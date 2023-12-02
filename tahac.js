// Token Action HUD for ACFVTT
// by Holipop


/** Constants
 */
const ID = 'token-action-hud-ac'
const CORE_ID = 'token-action-hud-core'
const REQUIRED_CORE_MODULE_VERSION = '1.5'

/** Classes
 */
let SystemManager, ActionHandler, RollHandler;

Hooks.on('tokenActionHudCoreApiReady', async core => {

    /**
     * Extends Token Action HUD Core's SystemManager class
     */
    SystemManager = class SystemManager extends core.api.SystemManager {

        /** Returns an instance of the ActionHandler to Token Action HUD Core
         * Called by Token Action HUD Core
         * @override
         * @returns {class} The ActionHandler instance
         */
        getActionHandler () {
            return new ActionHandler()
        }

        /** Returns a list of roll handlers to Token Action HUD Core
         * Used to populate the Roll Handler module setting choices
         * Called by Token Action HUD Core
         * @override
         * @returns {object} The available roll handlers
         */
        getAvailableRollHandlers () {
            return { core: 'Core Epithet/Anime Campaign' }
        }

        /** Returns an instance of the RollHandler to Token Action HUD Core
         * Called by Token Action HUD Core
         * @override
         * @param {string} id   The roll handler ID
         * @returns {class}     The RollHandler instance
         */
        getRollHandler (id) {
            return new RollHandler()
        }

        /** Returns the default layout and groups to Token Action HUD Core
         * Called by Token Action HUD Core
         * @returns {object} The default layout and groups
         */
        registerDefaults () {
            return { }
        }

        /** Register Token Action HUD system module settings
         * Called by Token Action HUD Core
         * @override
         * @param {function} coreUpdate The Token Action HUD Core update function
         */
        registerSettings (coreUpdate) { }

    }

    /**
     * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
     */
    ActionHandler = class ActionHandler extends core.api.ActionHandler {

        /** Build system actions
         * Called by Token Action HUD Core
         * @override
         * @param {array} ids
         */a
        async buildSystemActions (ids) {
            if (!this.actor) return;

            const categories = [...this.actor.system.categories]

            console.log(this)
            console.log(categories)
        }

    }

    /**
     * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
     */
    RollHandler = class RollHandler extends core.api.RollHandler {

        /** Handle action click
         * Called by Token Action HUD Core when an action is left or right-clicked
         * @override
         * @param {object} event
         * @param {string} code 
         */
        handleActionClick (event, code) {

        }

    }

})


/** Initialization
 */
Hooks.on('tokenActionHudCoreApiReady', async () => {
    // Return the SystemManager and requiredCoreModuleVersion to Token Action HUD Core
    const module = game.modules.get(ID)
    module.api = {
        requiredCoreModuleVersion: REQUIRED_CORE_MODULE_VERSION,
        SystemManager
    }
    Hooks.call('tokenActionHudSystemReady', module)
})
