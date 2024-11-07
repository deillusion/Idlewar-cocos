const DECORATION_MENU = [
    {
        category: "userIcon",
        index: 0,
        url: "",
        price: 0,
    },
    {
        category: "userIcon",
        index: 1,
        url: "file:heroIcon/1.png",
        price: 0,
    },
    {
        category: "userIcon",
        index: 2,
        url: "file:heroIcon/2.png",
        price: 0,
    },
    {
        category: "userIcon",
        index: 3,
        url: "file:heroIcon/3.png",
        price: 0,
    },
    {
        category: "userIcon",
        index: 4,
        url: "file:heroIcon/4.png",
        price: 0,
    },
    {
        category: "player",
        index: 1,
        url: "file:playerIcon/1.png",
        price: 0,
    },
    {
        category: "player",
        index: 2,
        url: "file:playerIcon/2.png",
        price: 0,
    },
    {
        category: "player",
        index: 3,
        url: "file:playerIcon/3.png",
        price: 0,
    },
    {
        category: "player",
        index: 4,
        url: "file:playerIcon/4.png",
        price: 0,
    },
    {
        category: "hero",
        index: 1,
        url: "file:hero/墨锋流影.png",
        price: 199,
    },
    {
        category: "hero",
        index: 2,
        url: "file:hero/清沐瑶音.png",
        price: 199,
    },
    {
        category: "hero",
        index: 3,
        url: "file:hero/寒英刃华.png",
        price: 199,
    },
    {
        category: "hero",
        index: 4,
        url: "file:hero/剑韵苍松.png",
        price: 199,
    },
    {
        category: "scene",
        index: 1,
        url: "file:scene/1.png",
        price: 100,
    },
    {
        category: "scene",
        index: 2,
        url: "file:scene/2.png",
        price: 100,
    },
    {
        category: "scene",
        index: 3,
        url: "file:scene/3.png",
        price: 100,
    },
    {
        category: "scene",
        index: 4,
        url: "file:scene/4.png",
        price: 100,
    },
]

const ONE_MINUTES = 60;
const ONE_HOUR = ONE_MINUTES * 60;
const ONE_JOURNEY_DAY = ONE_MINUTES * 1000;
const ONE_NATURAL_DAY = ONE_HOUR * 24;
const JOURNEY_START_TIME = new Date(0,0,1,6,40,0).valueOf()
export {
    DECORATION_MENU,
    ONE_JOURNEY_DAY,
    ONE_NATURAL_DAY,
    JOURNEY_START_TIME
}