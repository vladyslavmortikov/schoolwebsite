const Bot = require('node-telegram-bot-api');
const config = require('./config');
const User = require('./models/user');
const Item = require('./models/item');

const bot = new Bot(config.token, { polling: true });

// bot.on("polling_error", (err) => console.log(err));

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "НАЙГОЛОВНІШІ НОВИНИ ШКОЛИ ПРОСТО ЗАРАЗ! - \"/setlogin login\" ");
});

bot.onText(/\/setlogin (.+)/, (msg, [src, match]) => {
    const id = msg.chat.id;
    let currUser = 0;

    User.getByLogin(match)
        .then(user => {
            currUser = user;
            let us = { login: currUser.login, password: currUser.password, role: currUser.role, registeredAt: currUser.registeredAt, avaUrl: currUser.avaUrl, fullname: currUser.fullname, isDisabled: currUser.isDisabled, chatId: id };
            bot.sendMessage(msg.chat.id, `${us.login} is logged in!`);
            return User.update(currUser.id, us);
        })
        .then(() => console.log("success"))
        .catch(err => console.log(err));
});

bot.onText(/\/news/, (msg) => {
    const id = msg.chat.id;

    Item.getAll()
        .then(items => {
            const text = items.map((news) => {
                return `${news.title} - ${news.photo}`;
            }).join('\n');
            bot.sendMessage(id, text, { parse_mode: "HTML" });
        })
        .catch(err => console.log(err));
});

module.exports = bot;