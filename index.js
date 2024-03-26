const express = require("express");
const fs = require("fs");
const path = require('path');
const multer = require('multer');
const upload = multer({dest: '/home/ubuntu/fo-server/fo-stats/uploads'})
const app = express();
app.use(express.json());
const port = 3000;

const data_path = "/home/ubuntu/fo-server/fo-stats/data/p_data.json";
const player_data = load_player_data();
const _approved_directories = ["pages", "data", "css", "scripts", "img", "audio", "apps"];

app.get("/", (req, res) => {
  res.sendFile("pages/index.html", { root: __dirname });
});

app.get("/view", (req, res) => {
  res.sendFile("pages/view.html", { root: __dirname });
});

app.get("/apps", (req, res) => {
  res.sendFile("pages/apps.html", { root: __dirname });
});

app.get("/apps/:app", (req, res) => {
  res.sendFile(`/pages/${req.params.app}.html`, { root:__dirname });
});

app.get("/viewget-player-data", (req, res) => {
  res.send(JSON.stringify(player_data));
});

app.get("/save", (req, res) => {
  save_player_data();
  res.send(JSON.stringify(player_data));
});

app.get("/get-player-data", (req, res) => {
  res.send(JSON.stringify(player_data));
});

app.get("/new-player", (req, res) => {
  res.sendFile("pages/new-player.html", { root: __dirname });
});

app.get("/clear", (req, res) => {
  res.sendFile("pages/clear.html", { root: __dirname });
});

app.post("/wipe", (req, res) => {
  if (req.body.confirmed) {
    player_data.players = [];
    player_data.count = 0;
    
	  save_player_data();
    res.send('{"status": "success"}');
  }
  else
    res.send('{"status": "error"}');
});

app.get("/:dir/:file", (req, res) => {
  console.log(JSON.stringify(req.params));
  if (_approved_directories.includes(req.params.dir) == false)
    res.send('{"status": "error"}');
  else
    res.sendFile(`${req.params.dir}/${req.params.file}`, { root: __dirname });
});

app.get("/apps/:dir/:file", (req, res) => {
  if (_approved_directories.includes(req.params.dir) == false)
    res.send('{"status":"error"}');
  else
    res.sendFile(`apps/${req.params.dir}/${req.params.file}`, { root: __dirname });
});

app.get("/admin", (req, res) => {
  res.send(JSON.stringify(player_data));
});

app.post("/add-player", (req, res) => {
  const player = req.body;
  write_player_data(player);
});

app.post("/add-win", (req, res) => {
  let index = player_data.players.findIndex(
    (player) => player.number == req.body.player_num,
  );
  let player = player_data.players[index];

  if (player == null) {
    res.send('{"status" : "error"}');
    return;
  }

  let value = parseInt(req.body.value);

  player.wins = parseInt(player.wins) + value;
  res.send('{"status" : "success"}');
  save_player_data();
});

app.post("/add-loss", (req, res) => {
  let index = player_data.players.findIndex(
    (player) => player.number == req.body.player_num,
  );
  let player = player_data.players[index];

  if (player == null) {
    res.send('{"status" : "error"}');
    return;
  }
  let value = parseInt(req.body.value);

  player.losses = parseInt(player.losses) + value;
  res.send('{"status" : "success"}');
  save_player_data();
});

app.post("/add-gb", (req, res) => { 
  let index = player_data.players.findIndex(
    (player) => player.number == req.body.player_num
  );
  let player = player_data.players[index];

  if (player == null) {
    res.send('{"status":"success"}');
    return;
  }
  let value = parseInt(req.body.value);
  console.log("GBs To Be Added: " + value);
  player.gb = parseInt(player.gb) + value;
  res.send('{"status":"success"}');
  save_player_data();
});

app.listen(port, () => {
  console.log(`FO Stats listening on port ${port}`);
});

function write_player_data(player) {
  player.wins = 0;
  player.losses = 0;
  player_data.players.push(player);
  player_data.count = player_data.players.length;
  save_player_data();
}

function load_player_data() {
  fs.readFile(data_path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    data = JSON.parse(data);
    player_data.players = data.players;
    player_data.count = data.count;
  });

  return { players: [], count: 0 };
}

function save_player_data() {
  fs.writeFile(data_path, JSON.stringify(player_data), (err) => {
    if (err) console.log(err);
  });
}

// -------------- Campus Sales Code --------------------------------------------------
app.get("/sales", (req, res) => {
  res.status(200).send(JSON.stringify(data));
});

// Handles general get request
app.get("sales/posts", (req, res) => {
  let result = { posts: [] };
  result.posts = JSON.parse(JSON.stringify(data.posts));
  for (var i = 0; i < result.posts.length; i++) {
    delete result.posts[i].img;
  }
  res.status(200).send(JSON.stringify(result));
});

app.get("sales/image", (req, res) => {
  let inputs = req.query;

  console.log("Getting image for post: " + inputs.postId);

  let postIndex = findPostIndex(inputs.postId);
  let postImageName = data.posts[postIndex].img.originalname;
  let imagePath = "uploads/" + postImageName;
  //console.log("Attempting to retrieve image for post " + inputs.postId + " | index = " + postIndex);


  res.sendFile(imagePath, { root: __dirname }, (err) => {
    if (err) {
      console.error('Error sending image:', err);
      res.status(500).send('Error sending image');
    }
  });
});

app.get("sales/posts/filtered", (req, res) => {
  let inputs = req.query;

  let priceMax = inputs.price_max;
  let priceMin = inputs.price_min;
  let authId = inputs.auth_id;
  let oldest = inputs.oldest_stamp;
  let newest = inputs.newest_stamp;

  let output = {};

  if (authId != -1) {
    output.posts = JSON.parse(JSON.stringify(authorPosts(authId)));
  }

  for (var i = 0; i < output.posts.length; i++) {
    delete output.posts[i].img;
  }

  console.log("Retrieved Filtered Posts: " + JSON.stringify(output))
  res.status(200).send(JSON.stringify(output));
});

app.get("sales/messages", (req, res) => {
  let inputs = req.query;

  let user = findUserFromId(inputs.authId);
  console.log(JSON.stringify(user));
  let messages = { messages: user["messages"] };
  console.log(JSON.stringify(messages));
  res.status(200).send(JSON.stringify(messages));
});

// Register user account
app.post('sales/register', (req, res) => {
  let user = req.body.user;
  let pass = req.body.pass;
  let email = req.body.email;
  let auth_id = data.user_counter + 1;
  let newUser = { "username": user, "password": pass, "email": email, "auth_id": auth_id, "messages": [] };
  data.users.push(newUser);
  data.user_counter = data.user_counter + 1;
  newUser.result = true;
  saveData();
  res.status(200).send(JSON.stringify(newUser));
});

// Login in user account
app.post('sales/login', (req, res) => {
  console.log("Login request" + JSON.stringify(req.body));
  let pass = req.body.pass;
  let user = req.body.user;

  let result = findUser(user, pass);
  res.status(200).send(JSON.stringify(result));
});

// Handles uploading new posts to the server database
app.post('sales/upload', upload.single('file'), (req, res) => {
  // Access the uploaded file through req.file
  let newPost = {
    "title": req.body.title,
    "desc": req.body.desc,
    "price": req.body.price,
    "auth_id": req.body.authId,
    "post_id": data.post_counter + 1,
    "img": req.file
  };

  // Add post object to cached array
  savePost(newPost);
  // Save post data to file
  saveData();

  const uploadedFile = req.file;

  // Handle any errors during the upload process
  if (!uploadedFile) {
    res.status(400).send('No file uploaded');
    return;
  }

  const uploadDir = '/home/ubuntu/fo-server/fo-stats/uploads';

  // Create the directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Determine the new file path and rename the temporary file
  const newFilePath = path.join(uploadDir, uploadedFile.originalname);
  fs.rename(uploadedFile.path, newFilePath, (err) => {
    if (err) {
      console.error('Error moving the file:', err);
      res.status(500).send('Error saving the file');
      return;
    }
  });

  res.status(200).send("Successfully uploaded post");
});

app.post('sales/send', (req, res) => {
  let sender = req.body.sender;
  let recipient = req.body.recipient;
  let type = req.body.type;
  let contents = req.body.contents;
  let post_id = req.body.post_id;
  let post_title = req.body.post_title;

  let message = { sender: sender, recipient: recipient, type: type, contents: contents, post_id: post_id, post_title: post_title }

  let result = {};
  result["result"] = true;

  let sUser = findUserFromId(sender);
  let rUser = findUserFromId(recipient);

  message.sender_name = sUser.username;
  message.recipient_name = rUser.username;

  rUser.messages.push(message);
  saveData();

  res.send(JSON.stringify(result));
})

app.post('sales/delete/post', (req, res) => {
  let post_id = req.body.postId;
  let auth_id = req.body.authId;

  console.log("Delete Request: " + JSON.stringify(req.body))

  let postIndex = findPostIndex(post_id);
  let post = data.posts[postIndex];

  let result = {}

  if (auth_id == post.auth_id) {
    deletePost(post_id);
    result["result"] = true;
    res.status(200).send(JSON.stringify(result));
  }
  else {
    result["result"] = false;
    res.status(200).send(JSON.stringify(result));
  }
});

app.post('sales/delete/message', (req, res) => {
  let recipient = req.body.recipientId;
  let sender = req.body.senderId;
  let type = req.body.type;
  let post_id = req.body.postId;

  const findMessage = (message) => (message.sender == sender && message.recipient == recipient && message.type == type && message.post_id == post_id);
  let user = findUserFromId(recipient);
  let index = user.messages.findIndex(findMessage);
  user.messages.splice(index, 1);
  saveData();

  let result = { result: true };
  res.status(200).send(result);
})

// Reads in saved data from file
var data;
fs.readFile('/home/ubuntu/fo-server/fo-stats/data/s_data.txt', 'utf8', (err, input) => {
  if (err) {
    console.log(err);
    return;
  }
  data = JSON.parse(input);
  if (data.post_counter == -1)
    data.post_counter = data.posts.length;
  if (data.user_counter == -1)
    data.user_counter = data.users.length;
});

// Helper Functions -------------------------------------------------------------------------------------

// Saves all data to file
function saveData() {
  fs.writeFile('/home/ubuntu/fo-server/fo-stats/data/s_data.txt', JSON.stringify(data), (err) => {
    if (err)
      console.log(err);
  });
}

// Finds the index of the inputted post_id in the data array
function findPostIndex(postId) {
  const matchingPostId = (post) => post.post_id == postId;
  return data.posts.findIndex(matchingPostId);
}

// Finds the user object corresponding to the inputted username and password, empty object if null
function findUser(user, pass) {
  const detailsMatch = (account) => (account.username == user && account.password == pass);
  let index = data.users.findIndex(detailsMatch);
  let userObj = data.users[index];
  let result = { result: index != -1, auth_id: -1 };

  if (result.result) {
    result.auth_id = userObj.auth_id;
    result.email = userObj.email;
  }
  return result;
}

// Finds the user object of the inputted user id
function findUserFromId(id) {
  const userAuthId = (account) => (account.auth_id == id);
  let index = data.users.findIndex(userAuthId);
  let result = data.users[index];
  return result;
}

// Returns all the posts with a auth_id corresponding tot he inputted user id
function authorPosts(auth_id) {
  posts = [];
  for (i = 0; i < data.posts.length; i++) {
    if (data.posts[i].auth_id == auth_id) {
      posts.push(data.posts[i]);
    }
  }
  return posts;
}

// Adds post data to the array and increments post counter
function savePost(post) {
  data.posts.push(post);
  data.post_counter = data.post_counter + 1;
}

// Finds post from inputted post_id, removes the post from the data array and saves the data to file
function deletePost(post_id) {
  let postIndex = findPostIndex(post_id);
  data.posts.splice(postIndex, 1);
  saveData();
}
