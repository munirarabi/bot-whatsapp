const qrcode = require("qrcode-terminal");
const fs = require("fs");
const mime = require("mime-types");
const axios = require("axios");
const { Translate } = require("@google-cloud/translate").v2;
require("dotenv").config();

const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(
  "b6fa5b3cb648eba09b5259e2686a1da050016e3700f9a1b9ef577760c2ab6e3c"
);

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

const translateText = async (text, targetLanguage) => {
  try {
    let [response] = await translate.translate(text, targetLanguage);
    return response;
  } catch (error) {
    console.log(`Error at translateText --> ${error}`);
  }
};

const detectLanguage = async (text) => {
  try {
    let response = await translate.detect(text);
    return response[0].language;
  } catch (error) {
    console.log(`Error at detectLanguage --> ${error}`);
    return 0;
  }
};

const {
  Client,
  LocalAuth,
  MessageMedia,
  MessageTypes,
} = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("----------------------------------------------------");
  console.log("BOT online!!!!!!");
  console.log("----------------------------------------------------");
});

client.on("message_create", async (message) => {
  const textMessage = message.body.toLowerCase();
  const numberMessage = message.author;
  const firstCharacterOfTheMessageText = textMessage.slice(0, 1);
  const firstWordOfTheMessageText = message.body.split(" ")[0].toLowerCase();
  const commandContent = textMessage.replace(
    firstWordOfTheMessageText + " ",
    ""
  );
  const contactName55 = "55" + commandContent;

  // console.log(firstWordOfTheMessageText);

  if (firstCharacterOfTheMessageText === "/") {
    switch (textMessage) {
      case "/menu":
        console.log("case");
        console.log("Chamou /menu");
        client.sendMessage(
          message.from,
          `Menu do BOT, escolha a opção desejada:
  Criar uma figurinha digite "/1" (sem aspas).
  Foto de um gatinho digite "/2" (sem aspas). 🐈
  Foto de um cachorrinho digite "/3" (sem aspas). 🐶
  Meme digite "/4" (sem aspas). 😂
  Piada digite "/5" (sem aspas).  😎
  `
        );
        break;

      case "/1":
        console.log("Chamou /1");
        client.sendMessage(
          message.from,
          `Envie uma imagem com a legenda "/sticker" (sem as aspas).`
        );
        break;

      case "/2":
        console.log("Chamou /2");
        client.sendMessage(
          message.from,
          `Envie a mensagem "/cat" (sem as aspas).`
        );
        break;

      case "/3":
        console.log("Chamou /3");
        client.sendMessage(
          message.from,
          `Envie a mensagem "/dog" (sem as aspas).`
        );
        break;

      case "/4":
        console.log("Chamou /4");

        client.sendMessage(
          message.from,
          `Envie a mensagem "/meme" (sem as aspas).`
        );
        break;

      case "/5":
        console.log("Chamou /5");

        client.sendMessage(
          message.from,
          `Envie a mensagem "/piada" (sem as aspas).`
        );
        break;

      case "/s":
      case "/sticker":
      case "/figurinha":
      case "/fig":
      case "/f":
        console.log("Chamou " + textMessage);

        if (message.hasMedia) {
          message.downloadMedia().then(async (media) => {
            if (
              media.mimetype === "image/jpeg" ||
              media.mimetype === "image/webp"
            ) {
              const mediaPath = "./downloaded-media/";
              if (!fs.existsSync(mediaPath)) {
                fs.mkdirSync(mediaPath);
              }
              const extension = mime.extension(media.mimetype);
              const filename = new Date().getTime();
              const fullFilename = mediaPath + filename + "." + extension;
              try {
                fs.writeFileSync(fullFilename, media.data, {
                  encoding: "base64",
                });
                // console.log("Arquivo baixado com sucesso!", fullFilename);
                MessageMedia.fromFilePath((filePath = fullFilename));

                const contact = await message.getContact();
                // const number = await contact.getFormattedNumber();
                const nameContact = contact.pushname;

                client.sendMessage(
                  message.from,
                  new MessageMedia(media.mimetype, media.data, filename),
                  {
                    sendMediaAsSticker: true,
                    stickerName: `Criado por ${nameContact}`,
                    // stickerName: `Criado por Bot Golden`,
                    stickerAuthor: "Bot Golden",
                  }
                );
                message.react("👍");
                console.log("Figurinha enviada com sucesso!");
                fs.unlinkSync(fullFilename);
                // console.log(`Arquivo deletado com sucesso!`);
              } catch (err) {
                console.log("Erro ao fazer figurinha:", err);
                message.react("👎");
                message.reply(`Erro ao fazer figurinha!`);
              }
            } else if (media.mimetype === "video/mp4") {
              console.log("Sticker animado!");
              message.react("😔");
              message.reply("Ainda não faço sticker animado :(");
            } else {
              message.react("😐");
              console.log("O formato do arquivo precisa ser uma imagem.");
              message.reply(`O formato do arquivo precisa ser uma imagem.`);
            }
          });
        } else {
          message.reply(
            `Caso queira fazer uma figurinha envia uma imagem com o texto /sticker.`
          );
        }
        break;

      case "/meme":
        console.log("Chamou /meme");
        message.react("😂");
        const meme = await axios("https://meme-api.herokuapp.com/gimme").then(
          (res) => res.data
        );
        client.sendMessage(message.from, await MessageMedia.fromUrl(meme.url));
        break;

      case "/piada":
        console.log("Chamou /piada");
        message.react("😎");

        const joke = await axios(
          "https://v2.jokeapi.dev/joke/Any?safe-mode"
        ).then((res) => res.data);

        const jokeMsg = await client.sendMessage(message.from, joke.setup);

        if (joke.delivery)
          setTimeout(function () {
            jokeMsg.reply(joke.delivery);
          }, 500);
        break;

      case "/cat":
        console.log("Chamou /cat");
        message.react("🐈");
        const cat = await axios(
          "https://api.thecatapi.com/v1/images/search"
        ).then((res) => res.data);
        client.sendMessage(
          message.from,
          await MessageMedia.fromUrl(cat[0].url)
        );
        break;

      case "/dog":
        console.log("Chamou /dog");
        message.react("🐶");
        const dog = await axios(
          "https://api.thedogapi.com/v1/images/search"
        ).then((res) => res.data);
        client.sendMessage(
          message.from,
          await MessageMedia.fromUrl(dog[0].url)
        );
        break;

      case "/dt":
        const textDetected = textMessage.replace("/t ", "");

        await detectLanguage(textDetected)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
        break;

      case "/tt":
        const textTranslate = textMessage.replace("/tt ", "");

        const response = await translateText(textDetected, "en");

        message.reply(response);
        break;

      case "/se":
        const textSearch = textMessage.replace("/se ", "");

        let resultSearch;

        search.json(
          {
            q: textSearch,
            location: "Brazil",
          },
          (result) => {
            console.log(result)[0];
            resultSearch = result;
          }
        );
        break;

      default:
        message.reply(`Comando não existente!
Digite /menu para saber todos os comandos disponiveis.`);
        break;
    }
  } else if (firstCharacterOfTheMessageText === "@") {
    switch (firstWordOfTheMessageText) {
      case "@everyone":
      case "@everibode":
      case "@all":
        if (message.id.participant == undefined) {
          message.reply(`Essa função só funciona em grupo!`);
        } else {
          const chat = await message.getChat();

          let mentions = [];

          for (let participant of chat.participants) {
            const contact = await client.getContactById(
              participant.id._serialized
            );

            mentions.push(contact);
            text += `@${participant.id.user} `;
          }

          await chat.sendMessage(`*${commandContent}*`, { mentions });
        }

        break;

      default:
        message.reply(`Comando não existente!
Digite /menu para saber todos os comandos disponiveis.`);
        break;
    }
  } else if (firstCharacterOfTheMessageText === "!") {
    switch (firstWordOfTheMessageText) {
      case "!add":
        if (message.id.participant == undefined) {
          message.reply(`Essa função só funciona em grupo!`);
        } else {
          client.getChats().then(async (chats) => {
            const chat = await message.getChat();
            const chatName = chat.name;
            const contactName = "55" + commandContent + "@c.us";
            const myGroup = chats.find(
              async (chat) => (await chat.name) === chatName
            );
            myGroup
              .addParticipants([contactName])
              .then(() =>
                console.log(
                  `${commandContent} adicionado ao grupo ${chatName} com sucesso!`
                )
              )
              .catch((error) => {
                console.log(error);
                client.sendMessage(message.from, "Erro no comando!");
              });
          });
        }
        break;

      case "!remove":
        if (message.id.participant == undefined) {
          message.reply(`Essa função só funciona em grupo!`);
        } else {
          await client.getChats().then(async (chats) => {
            const chatGroup = await message.getChat();
            const chatName = chatGroup.name;
            const numberContact = "55" + commandContent + "@c.us";
            const numberContactFormatted = await message.author.substring(
              0,
              13
            );

            const myGroup = chats.find(
              async (chat) => (await chat.name) === chatName
            );

            const participants = await myGroup.participants;

            for (let index = 0; index < participants.length; index++) {
              if (participants[index].id.user == numberContactFormatted) {
                if (participants[index].isAdmin != true) {
                  client.sendMessage(
                    message.from,
                    "Você não é admin pra executar esse comando!"
                  );
                } else {
                  myGroup
                    .removeParticipants([numberContact])
                    .then(async () => {
                      const participants = await myGroup.participants;
                      const arrParticipants = [];

                      for (
                        let index = 0;
                        index < participants.length;
                        index++
                      ) {
                        arrParticipants.push(participants[index].id.user);
                      }

                      console.log(arrParticipants);

                      if (arrParticipants.indexOf(contactName55) == -1) {
                        await client.sendMessage(
                          message.from,
                          "Esse número não está no grupo!"
                        );
                      } else {
                        await client.sendMessage(
                          message.from,
                          `${contactName55} removido com sucesso!`
                        );
                      }
                    })
                    .catch(() => {
                      console.log("Erro no número.");
                      client.sendMessage(
                        message.from,
                        `Para remover alguem digite !remove e o número. 
Por exemplo:
!remove 15981080115
  `
                      );
                    });

                  return;
                }
              }
            }
          });
        }
        break;

      case "!reg":
        const contactName = "55" + commandContent + "@c.us";
        try {
          const register = async () => {
            console.log(await client.isRegisteredUser(contactName));
          };
          register();
        } catch (error) {
          console.log(error);
        }
        break;

      default:
        message.reply(`Comando não existente!
Digite /menu para saber todos os comandos disponiveis.`);
        break;
    }
  }
});

client.initialize();
