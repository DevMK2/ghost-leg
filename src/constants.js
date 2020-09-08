//\ GAME PROPERTIES
export const ROW = 5;
export const COL = 3;

export const LADDER_MARGIN = 200;
export const LADDER_HEIGHT = 500;
export const LADDER_WIDTH = 600;

export const LADDER_HGAP = LADDER_HEIGHT / (ROW + 1);
export const LADDER_WGAP = LADDER_WIDTH / (COL + 1);

//\ GAME TYPES
export const NORMAL_MODE = 'NORMAL';
export const EXPERT_MODE = 'EXPERT';

//\ ASSETS NAMESPACE
export const ASSETS_KEY = {
    background: 'BACKGROUND',
    logo: 'LOGO',
    buttonNormal: 'BUTTON_NORMAL',
    buttonExpert: 'BUTTON_EXPORT',
    buttonStart: 'BUTTON_START',
    rocket: 'ROCKET',
    blind: 'BLIND',
    flame: 'FLAME',
    destination: ['DESTINATION_1', 'DESTINATION_2', 'DESTINATION_3'],
    starting: ['STARTING_1', 'STARTING_2', 'STARTING_3'],
};
