/** @import { GameData, Character } from '../../gamedata_typedefs.js' */

const hasHeldCourtOrCouncilPosition = (character) => {
  const positions = typeof character?.heldCourtAndCouncilPositions === "string"
    ? character.heldCourtAndCouncilPositions.trim()
    : "";
  return positions.length > 0 && !["none", "no", "n/a"].includes(positions.toLowerCase());
};

// [MODIFIED BY AI - AUH COMPATIBILITY]
// Note to original author: This file was modified to support the All Under Heaven (AUH) DLC's Administrative Government.
// The runGameEffect logic now checks if the target uses Celestial Empires (`tgp_has_access_to_ministry_trigger = yes`).
// If so, it uses `destroy_held_ministry_titles_effect` to remove them from power, otherwise it falls back to `fire_councillor`.
module.exports = {
  signature: "isFiredFromCouncilOf",
  title: {
    en: "Source Fired from Target's Council",
    ru: "Исходный персонаж уволен из совета цели",
    fr: "La source a été licenciée du conseil de la cible",
    de: "Quellcharakter aus dem Rat des Ziels entlassen",
    es: "La fuente fue despedida del consejo del objetivo",
    ja: "ソースがターゲットの評議会から解任",
    ko: "출처가 대상의 평의회에서 해고됨",
    pl: "Źródło zwolnione z rady celu",
    zh: "从目标的内阁被解职"
  },

  /**
   * @param {object} params
   * @param {Character} params.sourceCharacter
   */
  args: ({ sourceCharacter }) => [],

  /**
   * @param {object} params
   * @param {Character} params.sourceCharacter
   */
  description: ({ sourceCharacter }) =>
    `Execute when ${sourceCharacter.shortName} is fired/dismissed/retired from the target character's council.`,

  /**
   * @param {object} params
   * @param {GameData} params.gameData
   * @param {Character} params.sourceCharacter
   */
  check: ({ gameData, sourceCharacter }) => {
    const allIds = Array.from(gameData.characters.keys());
    const sourceHasOffice = hasHeldCourtOrCouncilPosition(sourceCharacter);
    const validTargets = sourceHasOffice
      ? allIds.filter((id) => {
          const char = gameData.characters.get(id);
          return char && char.isLandedRuler && id !== sourceCharacter.id;
        })
      : [];
    return {
      canExecute: validTargets.length > 0,
      validTargetCharacterIds: validTargets,
    };
  },

  /**
   * @param {object} params
   * @param {GameData} params.gameData
   * @param {Character} params.sourceCharacter
   * @param {Character} params.targetCharacter
   * @param {Function} params.runGameEffect
   * @param {Record<string, number|string|boolean|null>} params.args
   * @param {string} params.lang - Language code for i18n
   */
  run: ({ gameData, sourceCharacter, targetCharacter, runGameEffect, args, lang }) => {
    if (!targetCharacter) {
      return {
        message: {
          en: "Failed: No target character specified",
          ru: "Ошибка: Целевой персонаж не указан",
          fr: "Échec : Aucun personnage cible spécifié",
          de: "Fehler: Kein Zielcharakter angegeben",
          es: "Error: No se especificó un personaje objetivo",
          ja: "失敗: ターゲットキャラクターが指定されていません",
          ko: "실패: 대상 캐릭터가 지정되지 않았습니다",
          pl: "Niepowodzenie: Nie określono postaci docelowej",
          zh: "失败: 未指定目标角色"
        },
        sentiment: 'negative'
      };
    }

    if (!targetCharacter.isLandedRuler) {
      return {
        message: {
          en: `Failed: ${targetCharacter.shortName} is not a landed ruler and cannot have a council`,
          ru: `ÐžÑˆÐ¸Ð±ÐºÐ°: ${targetCharacter.shortName} Ð½Ðµ ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ð·ÐµÐ¼Ð»ÐµÐ²Ð»Ð°Ð´ÐµÐ»ÑŒÑ†ÐµÐ¼ Ð¸ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ‚ Ð¸Ð¼ÐµÑ‚ÑŒ ÑÐ¾Ð²ÐµÑ‚`,
          fr: `Ã‰chec : ${targetCharacter.shortName} n'est pas un dirigeant terrien et ne peut pas avoir de conseil`,
          de: `Fehler: ${targetCharacter.shortName} ist kein Landesherrscher und kann keinen Rat haben`,
          es: `Error: ${targetCharacter.shortName} no es un gobernante con tierras y no puede tener consejo`,
          ja: `å¤±æ•—: ${targetCharacter.shortName}ã¯é ˜ä¸»ã§ã¯ãªãã€è©•è­°ä¼šã‚’æŒã¤ã“ã¨ãŒã§ãã¾ã›ã‚“`,
          ko: `ì‹¤íŒ¨: ${targetCharacter.shortName}ì€(ëŠ”) ì˜ì£¼ê°€ ì•„ë‹ˆë©° í‰ì˜íšŒë¥¼ ê°€ì§ˆ ìˆ˜ ì—†ìŠµë‹ˆë‹¤`,
          pl: `Niepowodzenie: ${targetCharacter.shortName} nie jest wÅ‚adcÄ… lÄ…dowym i nie moÅ¼e mieÄ‡ rady`,
          zh: `å¤±è´¥: ${targetCharacter.shortName}æ²¡æœ‰å°åœ°ï¼Œæ— æ³•æ‹¥æœ‰å†…é˜`
        },
        sentiment: 'negative'
      };
    }

    if (!hasHeldCourtOrCouncilPosition(sourceCharacter)) {
      return {
        message: {
          en: `Failed: ${sourceCharacter.shortName} has no logged court or council office to remove`,
        },
        sentiment: 'negative'
      };
    }

    runGameEffect(`
global_var:votc_action_target = {
    save_scope_as = councillor_liege
    if = {
        limit = {
            tgp_has_access_to_ministry_trigger = yes
        }
        global_var:votc_action_source = {
            destroy_held_ministry_titles_effect = yes
        }
    }
    if = {
        limit = {
            global_var:votc_action_source = {
                is_councillor_of = scope:councillor_liege
            }
        }
        fire_councillor = global_var:votc_action_source
    }
}`);

    return {
      message: {
        en: `${sourceCharacter.shortName} is no longer a councillor of ${targetCharacter.shortName}`,
        ru: `${sourceCharacter.shortName} больше не является советником ${targetCharacter.shortName}`,
        fr: `${sourceCharacter.shortName} n'est plus conseiller de ${targetCharacter.shortName}`,
        de: `${sourceCharacter.shortName} ist nicht mehr Rat von ${targetCharacter.shortName}`,
        es: `${sourceCharacter.shortName} ya no es consejero de ${targetCharacter.shortName}`,
        ja: `${sourceCharacter.shortName}はもう${targetCharacter.shortName}の評議員ではありません`,
        ko: `${sourceCharacter.shortName}은(는) 더 이상 ${targetCharacter.shortName}의 평의원이 아닙니다`,
        pl: `${sourceCharacter.shortName} nie jest już doradcą ${targetCharacter.shortName}`,
        zh: `${sourceCharacter.shortName}不再是${targetCharacter.shortName}的内阁成员`
      },
      sentiment: 'negative'
    };
  },
};
