async function getAccessToken() {
  const token = await fetch("token.txt")
    .then((res) => res.text())
    .then((data) => {
      return data;
    });
  return token;
}

async function getInstagramMedia() {
  const url = "https://graph.instagram.com/me/media";
  const token = await getAccessToken();
  const media = await axios
    .get(url, {
      params: {
        access_token: token,
        fields: "media_url,media_type,caption,permalink",
      },
    })
    .then((response) => {
      return response.data;
    });

  return media.data;
}

async function parseDataToHTML() {
  const data = await getInstagramMedia();

  let conteudo = "";
  for ({ media_url, media_type, caption, permalink } of data) {
    if (media_type === "VIDEO") {
      conteudo += `
      <div class="media">
        <video controls>
          <source src="${media_url}" type="video/mp4">
        </video>
      </div>
        `;
    } else if (media_type === "IMAGE") {
      conteudo += `
      <div class="media">
        <img src="${media_url}" onclick="window.open('${permalink}')">
      </div>
        `;
    }
  }
  document.querySelector("#gallery").innerHTML = conteudo;
}

parseDataToHTML();
