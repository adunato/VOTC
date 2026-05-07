/** @import { GameData, Character } from '../../gamedata_typedefs.js' */
module.exports = {
    signature: "isUndressed",
    title: {
        en: "Undress Character",
        ru: "Раздеть персонажа",
        fr: "Déshabiller le personnage",
        de: "Charakter entkleiden",
        es: "Desnudar personaje",
        ja: "キャラクターを脱がす",
        ko: "캐릭터 옷 벗기기",
        pl: "Rozbierz postać",
        zh: "宽衣解带"
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
        `Execute when the target character should become visually undressed in CK3/VOTC portraits. Applies CK3's is_naked character flag for one day; visibility still depends on CK3 nudity and portrait rules.`,

    /**
     * @param {object} params
     * @param {GameData} params.gameData
     * @param {Character} params.sourceCharacter
     */
    check: ({ gameData, sourceCharacter }) => {
        const allIds = Array.from(gameData.characters.keys());
        const validTargets = allIds.filter((id) => {
            const char = gameData.characters.get(id);
            return char && char.age >= 16;
        });
        return {
            canExecute: validTargets.length > 0,
            validTargetCharacterIds: validTargets
        };
    },

    /**
     * @param {object} params
     * @param {GameData} params.gameData
     * @param {Character} params.sourceCharacter
     * @param {Character} params.targetCharacter
     * @param {Function} params.runGameEffect
     * @param {Record<string, number|string|null>} params.args
     * @param {string} params.lang - Language code for i18n
     */
    run: ({ gameData, sourceCharacter, targetCharacter, runGameEffect, lang = "en" }) => {
        if (!targetCharacter) return;

        if (targetCharacter.age < 16) {
            return {
                message: {
                    en: `Failed: ${targetCharacter.shortName} is not an adult and cannot be made visually undressed.`
                },
                sentiment: 'negative'
            };
        }

        runGameEffect(`
global_var:votc_action_target = {
    add_character_flag = {
        flag = is_naked
        days = 1
    }
}`);
        return {
            message: {
                en: `${targetCharacter.shortName} is undressed`,
                ru: `${targetCharacter.shortName} раздет`,
                fr: `${targetCharacter.shortName} est déshabillé`,
                de: `${targetCharacter.shortName} ist entkleidet`,
                es: `${targetCharacter.shortName} está desnudo`,
                ja: `${targetCharacter.shortName}は裸です`,
                ko: `${targetCharacter.shortName}은(는) 벌거벗었습니다`,
                pl: `${targetCharacter.shortName} jest rozebrany`,
                zh: `${targetCharacter.shortName}衣衫尽褪`
            },
            sentiment: 'neutral'
        };
    },
}
