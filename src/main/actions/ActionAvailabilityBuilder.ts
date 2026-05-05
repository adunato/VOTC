import { Character } from "../gameData/Character";
import { GameData } from "../gameData/GameData";
import { actionRegistry } from "./ActionRegistry";
import { resolveI18nString } from "./i18nUtils";
import { ActionArgumentDefinition } from "./types";

export interface AvailableActionPromptArg {
  name: string;
  displayName?: string;
  type: string;
  description: string;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
}

export interface AvailableActionPromptInfo {
  actionId: string;
  title?: string;
  description: string;
  args: AvailableActionPromptArg[];
  validTargetCharacterIds?: number[];
}

function resolveArgs(
  rawArgs: ActionArgumentDefinition[] | ((context: { gameData?: GameData; sourceCharacter: Character }) => ActionArgumentDefinition[]),
  gameData: GameData,
  sourceCharacter: Character,
  userLang: string
): AvailableActionPromptArg[] {
  const args = typeof rawArgs === "function"
    ? rawArgs({ gameData, sourceCharacter })
    : rawArgs;

  return args.map((arg) => ({
    name: arg.name,
    displayName: arg.displayName,
    type: arg.type,
    description: resolveI18nString(arg.description, userLang),
    required: arg.required,
    options: arg.type === "enum" ? arg.options : undefined,
    min: arg.type === "number" ? arg.min : undefined,
    max: arg.type === "number" ? arg.max : undefined,
  }));
}

function describeTargets(gameData: GameData, targetIds?: number[]): string | null {
  if (!targetIds || targetIds.length === 0) {
    return null;
  }

  const targetNames = targetIds
    .map((id) => gameData.characters.get(id)?.shortName || gameData.characters.get(id)?.fullName)
    .filter((name): name is string => !!name);

  if (targetNames.length === 0) {
    return null;
  }

  const shown = targetNames.slice(0, 12);
  const suffix = targetNames.length > shown.length ? `, and ${targetNames.length - shown.length} more` : "";
  return `Valid targets: ${shown.join(", ")}${suffix}.`;
}

function describeArg(arg: AvailableActionPromptArg): string {
  const label = arg.displayName || arg.name;
  const details: string[] = [];

  if (arg.options?.length) {
    details.push(`options: ${arg.options.join(", ")}`);
  }
  if (arg.min !== undefined || arg.max !== undefined) {
    details.push(`range: ${arg.min ?? "-infinity"} to ${arg.max ?? "infinity"}`);
  }
  if (arg.required) {
    details.push("required");
  }

  const suffix = details.length ? ` (${details.join("; ")})` : "";
  return `${label}: ${arg.description}${suffix}`;
}

export class ActionAvailabilityBuilder {
  static async buildAvailableActions(
    gameData: GameData,
    sourceCharacter: Character,
    userLang: string
  ): Promise<AvailableActionPromptInfo[]> {
    const loaded = actionRegistry.getAllActions(/* includeDisabled = */ false);
    const available: AvailableActionPromptInfo[] = [];

    for (const act of loaded) {
      if (act.id === "noOp") {
        continue;
      }

      try {
        const checkResult = await act.definition.check({ gameData, sourceCharacter });
        if (!checkResult?.canExecute) {
          continue;
        }

        const description = typeof act.definition.description === "function"
          ? resolveI18nString(act.definition.description({ gameData, sourceCharacter }), userLang)
          : resolveI18nString(act.definition.description, userLang);

        const title = act.definition.title
          ? resolveI18nString(act.definition.title, userLang)
          : undefined;

        available.push({
          actionId: act.id,
          title,
          description,
          args: resolveArgs(act.definition.args, gameData, sourceCharacter, userLang),
          validTargetCharacterIds: checkResult.validTargetCharacterIds,
        });
      } catch (error) {
        console.error(`Failed to build available action prompt info for ${act.id}:`, error);
      }
    }

    return available;
  }

  static formatForChatPrompt(actions: AvailableActionPromptInfo[], gameData: GameData): string {
    if (actions.length === 0) {
      return "No concrete game-state actions are currently available.";
    }

    return actions.map((action) => {
      const label = action.title || "Available action";
      const parts = [`- ${label}: ${action.description}`];
      const targets = describeTargets(gameData, action.validTargetCharacterIds);
      if (targets) {
        parts.push(`  ${targets}`);
      }
      if (action.args.length > 0) {
        parts.push(`  Details: ${action.args.map(describeArg).join("; ")}`);
      }
      return parts.join("\n");
    }).join("\n");
  }

  static async buildListAvailableActionsText(
    gameData: GameData,
    sourceCharacter: Character,
    userLang: string
  ): Promise<string> {
    const actions = await this.buildAvailableActions(gameData, sourceCharacter, userLang);
    return this.formatForChatPrompt(actions, gameData);
  }
}
