// Token Action HUD for ACFVTT
// by Holipop


/** Classes
 */
let SystemManager, ActionHandler, RollHandler;

Hooks.on('tokenActionHudCoreApiReady', async core => {

    /** 
     * Extends Token Action HUD Core's SystemManager class
     */
    SystemManager = class SystemManager extends core.api.SystemManager {

        /** Returns an instance of the ActionHandler to Token Action HUD Core
         * @override
         * @returns {class} The ActionHandler instance
         */
        getActionHandler () {
            return new ActionHandler()
        }

        /** Returns a list of roll handlers to Token Action HUD Core
         * Used to populate the Roll Handler module setting choices
         * @override
         * @returns {object} The available roll handlers
         */
        getAvailableRollHandlers () {
            return { core: 'Core Epithet/Anime Campaign' }
        }

        /** Returns an instance of the RollHandler to Token Action HUD Core
         * @override
         * @param {string} id   The roll handler ID
         * @returns {class}     The RollHandler instance
         */
        getRollHandler (id) {
            return new RollHandler()
        }

        /** Returns the default layout and groups to Token Action HUD Core
         * @override
         * @returns {object} The default layout and groups
         */
        async registerDefaults () {
            const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
            const ids = ['kit']

            const groups = ids.map(id => {
                return { id, name: capitalize(id), type: 'system' }
            })
            const layout = [{
                id: 'kit', 
                nestId: 'kit',
                name: capitalize('kit'),
                groups: groups.map(group => {
                    return { ...group, nestId: `kit_${group.id}` }
                })
            }]

            console.log({ layout, groups })

            return {
                layout: [
                    {
                        id: 'kit', 
                        nestId: 'kit',
                        name: 'Kit',
                        groups: [
                            { id: 'kit', nestId: 'kit_kit', name: 'Kit', type: 'system' }
                        ]
                    }
                ],
                group: [
                    { id: 'kit', name: 'Kit', type: 'system' }
                ]
            }
            
            return { layout, groups }
        }

        /** Register Token Action HUD system module settings
         * @override
         * @param {function} coreUpdate The Token Action HUD Core update function
         */
        registerSettings (onChangeFunction) { }

    }

    /**
     * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
     */
    ActionHandler = class ActionHandler extends core.api.ActionHandler {

        /** Build system actions
         * @override
         * @param {array} ids
         */
        async buildSystemActions (_) {
            if (!this.actor) return;

            for (const category of this.actor.system.categories) {
                this.addGroup(
                    { id: category.name, name: category.name, type: 'system' },
                    { id: 'kit', type: 'system' }
                )
            }

            for (const item of this.actor.items) {
                const action = {
                    id: item._id,
                    name: item.name,
                    encodedValue: `item|${item._id}`,
                    img: item.img
                }
                const group = {
                    id: item.system.category,
                    type: 'system'
                }

                this.addActions([action], group)
            }
        }

    }

    /**
     * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
     */
    RollHandler = class RollHandler extends core.api.RollHandler {

        /** Handle when an action is left or right-clicked
         * @override
         * @param {object} event
         * @param {string} code 
         */
        handleActionClick (event, code) {
            const [, id] = code.split(this.delimiter)
            const item = this.actor.getEmbeddedDocument("Item", id)

            const post = (event.which === 3) // if right click was used
            item.roll({ post });
        }

    }

})


/** Initialization
 */
const ID = 'token-action-hud-ac'
const CORE_ID = 'token-action-hud-core'
const REQUIRED_CORE_MODULE_VERSION = '1.5'

Hooks.on('tokenActionHudCoreApiReady', async () => {
    // Return the SystemManager and requiredCoreModuleVersion to Token Action HUD Core
    const module = game.modules.get(ID)
    module.api = {
        requiredCoreModuleVersion: REQUIRED_CORE_MODULE_VERSION,
        SystemManager
    }
    Hooks.call('tokenActionHudSystemReady', module)
})
