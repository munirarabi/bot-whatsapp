const qrcode = require("qrcode-terminal");
const fs = require("fs");
const mime = require("mime-types");
const axios = require("axios");

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
  const messagePrimary = message.body.split(" ");
  const bodyMessage = message.body;

  // if (bodyMessage[0] === "/pesquisar") {
  //   const messageSearch = message.body.replace("/pesquisar ", "");
  //   const result = await client.searchMessages(messageSearch);

  //   if (result.length < 1) {
  //     message.reply("Nenhuma mensagem encontrada.");
  //   } else {
  //     console.log("Quantidade de resultados: " + result.length + ".");

  //     result.map(async (res) => {
  //       const remetente = await client.getFormattedNumber(res.from);
  //       console.log("Remetente: " + remetente);
  //       // console.log("Mensagem: " + res.body);
  //     });
  //   }
  // }

  /*if (bodyMessage === "pls meme") {
    const meme = await axios("https://meme-api.herokuapp.com/gimme").then(
      (res) => res.data
    );
    client.sendMessage(message.from, await MessageMedia.fromUrl(meme.url));
  } else if (bodyMessage === "pls joke" || bodyMessage === "Pls joke") {
    const joke = await axios("https://v2.jokeapi.dev/joke/Any?safe-mode").then(
      (res) => res.data
    );
    const jokeMsg = await client.sendMessage(message.from, joke.setup);
    if (joke.delivery)
      setTimeout(function () {
        jokeMsg.reply(joke.delivery);
      }, 500);
  }*/

  if (message.body === "/menu") {
    console.log("Chamou /menu");
    client.sendMessage(
      message.from,
      `Menu do MumuBOT, escolha a opção desejada:
Criar uma figurinha digite "/1" (sem aspas).
Foto de um gatinho digite "/2" (sem aspas). 🐈
Foto de um cachorrinho digite "/3" (sem aspas). 🐶
Meme digite "/4" (sem aspas). 😂
Piada digite "/5" (sem aspas).  😎
`
    );
    // Temperatura com base no DDD digite "/6" (sem aspas). 🌧
  } else if (message.body === "/1") {
    console.log("Chamou /1");
    client.sendMessage(
      message.from,
      `Envie uma imagem com a legenda "/sticker" (sem as aspas).`
    );
  } else if (message.body === "/2") {
    console.log("Chamou /2");
    client.sendMessage(message.from, `Envie a mensagem "/cat" (sem as aspas).`);
  } else if (message.body === "/3") {
    console.log("Chamou /3");

    client.sendMessage(message.from, `Envie a mensagem "/dog" (sem as aspas).`);
  } else if (message.body === "/4") {
    console.log("Chamou /4");

    client.sendMessage(
      message.from,
      `Envie a mensagem "/meme" (sem as aspas).`
    );
  } else if (message.body === "/5") {
    console.log("Chamou /5");

    client.sendMessage(
      message.from,
      `Envie a mensagem "/piada" (sem as aspas).`
    );
  } else if (message.body === "/6") {
    console.log("Chamou /6");

    message.from(
      `Envie a mensagem "/temperatura" (sem as aspas). Por exemplo: "/temperatura Alphaville"`
    );
  }
  if (message.body === "/s" || message.body === "/sticker") {
    console.log("Chamou " + message.body);

    if (message.hasMedia) {
      message.downloadMedia().then((media) => {
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
            fs.writeFileSync(fullFilename, media.data, { encoding: "base64" });
            // console.log("Arquivo baixado com sucesso!", fullFilename);
            MessageMedia.fromFilePath((filePath = fullFilename));
            client.sendMessage(
              message.from,
              new MessageMedia(media.mimetype, media.data, filename),
              {
                sendMediaAsSticker: true,
                stickerAuthor: "",
                stickerName: "",
              }
            );
            // console.log("Fazendo figurinha!");
            //             message.reply(`Estou fazendo sua figurinha.
            // Um momento...`);
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
      console.log("Mandou um arquivo sem /s");
      // message.reply(
      //   `Caaaaso queira fazer uma figurinha, você precisará: enviar uma imagem com a palavra "s" (sem as aspas), e o bot te retornara ela em forma de sticker.`
      // );
    }
  } else if (message.body === "/meme") {
    console.log("Chamou /meme");
    message.react("😂");
    const meme = await axios("https://meme-api.herokuapp.com/gimme").then(
      (res) => res.data
    );
    client.sendMessage(message.from, await MessageMedia.fromUrl(meme.url));
  } else if (message.body === "/piada") {
    console.log("Chamou /piada");
    message.react("😎");
    const joke = await axios("https://v2.jokeapi.dev/joke/Any?safe-mode").then(
      (res) => res.data
    );
    const jokeMsg = await client.sendMessage(message.from, joke.setup);
    if (joke.delivery)
      setTimeout(function () {
        jokeMsg.reply(joke.delivery);
      }, 500);
  } else if (message.body === "/cat") {
    console.log("Chamou /cat");
    message.react("🐈");
    const cat = await axios("https://api.thecatapi.com/v1/images/search").then(
      (res) => res.data
    );
    client.sendMessage(message.from, await MessageMedia.fromUrl(cat[0].url));
  } else if (message.body === "/dog") {
    console.log("Chamou /dog");
    message.react("🐶");
    const dog = await axios("https://api.thedogapi.com/v1/images/search").then(
      (res) => res.data
    );
    client.sendMessage(message.from, await MessageMedia.fromUrl(dog[0].url));
  }
  // else if (messagePrimary[0] === "/temperatura") {
  //   // const numberFormatted = await client.getFormattedNumber(message.from);
  //   // const ddd = numberFormatted.split("")[4] + numberFormatted.split("")[5];

  //   const cityTemp = message.body.replace("/temperatura ", "");
  //   const cityTest = cityTemp.split(" ");

  //   try {
  //     let url = ``;
  //     console.log(cityTest);

  //     if (cityTest.length == 1) {
  //       url = `https://api.openweathermap.org/data/2.5/weather?q=${cityTest}&units=metric&APPID=7e12b274c5bde7277c354df4317d7e18`;
  //     } else if (cityTest.length == 2) {
  //       let words = [];
  //       for (let index = 0; index < cityTest.length; index++) {
  //         console.log(index);
  //         words.push(cityTest[index]);
  //       }
  //       console.log(words);

  //       url = `https://api.openweathermap.org/data/2.5/weather?q=são%20paulo&units=metric&APPID=7e12b274c5bde7277c354df4317d7e18`;
  //             'https://api.openweathermap.org/data/2.5/weather?q=s%C3%A3o%20paulo&units=metric&APPID=7e12b274c5bde7277c354df4317d7e18'
  //     }

  //     const req = axios.get(url);
  //     const res = await req;

  //     console.log(res)
  //     console.log(`Temperatura em ${res.data.name}: ${res.data.main.temp} graus.`);
  //   } catch (error) {
  //     if (error.message === "Request failed with status code 404") {
  //       // console.log(error);
  //       console.log("Local não encontrado!");
  //     } else {
  //       console.log(error);
  //       console.log("Erro ao buscar temperatura");
  //     }
  //   }

  //   // console.log(": " + res);
  //   // console.log(": " + res);

  //   // fetch(
  //   //   `https://api.openweathermap.org/data/2.5/weather?q=${cityTemp}&units=metric&APPID=7e12b274c5bde7277c354df4317d7e18`
  //   // )
  //   //   .then((res) => res.json())
  //   //   .then((result) => {
  //   //     client.sendMessage(result);
  //   //   });

  //   //     message.react("☹");
  //   //     message.reply(`Essa função ainda está em desenvolvimento..
  //   // Tente novamente mais tarde!`);
  // }
});

client.initialize();
