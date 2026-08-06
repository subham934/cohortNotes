const followModel = require("../models/follow.model");
const userModel = require('../models/user.model');


async function followUserController(req, res) {
  // kyunki humne identifyUser middleware use kiya hai , aur uska kaam rehta hai ki kaun sa user request kar raha hai usse identify karke req.user variable me store karna , toh req.user se yaha pe jo bhi user request kar raha hai uska USERNAME nikal liya

  const followerUsername = req.user.username; // yaha pe jo bhi user request kar raha hai usska id nikal liya

  const followeeUsername = req.params.username; //  req.params.username => URL mein jo ":username" tha woh yahan milta hai

  // Can't follow yourself logic
  if (followerUsername === followeeUsername) {
    return res.status(400).json({
      message: "You cannot follow yourself!",
    });
  }

  
  // now, to check if the user we want to follow exist or not, for that we write a logic below as

  const isFolloweeUser = await userModel.findOne({ username: followeeUsername });

  if (!isFolloweeUser) {
    return res.status(404).json({
      message: `User ${followeeUsername} not found!`,
    });
  } 



  // cant follow one user multiple times
  const isAlreadyFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (isAlreadyFollowing) {
    return res.status(409).json({
      message: `You are already following ${followeeUsername}!`,
      follow: isAlreadyFollowing,
    });
  }



  // now , followerUsername wants to follow followeeUsername , for that we write a logic below as

  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
  });

  res.status(201).json({
    message: `You are now following ${followeeUsername}!`,
    follow: followRecord,
  });
}

async function unfollowUserController(req, res){
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  const isUserFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if(!isUserFollowing){
    return res.status(404).json({
      message: `You are not following ${followeeUsername}!`,
    });
  }

  await followModel.findByIdAndDelete(isUserFollowing._id);

  res.status(200).json({
    message: `You have unfollowed ${followeeUsername}!`,
  });
}

async function acceptFollowController(req, res) {

  // followee = jo accept/reject kar raha hai = request karne wala
  const followeeUsername = req.user.username;

  // follower = jisne follow request bheja tha = URL se aayega
  const followerUsername = req.params.username;

  // DB mein us record ko dhundo aur status update karo
  const followRecord = await followModel.findOneAndUpdate(
    { follower: followerUsername, followee: followeeUsername },
    { status: "accepted" },
    { new: true }  // updated document return karo
  );

  if (!followRecord) {
    return res.status(404).json({
      message: "Follow request not found!",
    });
  }

  res.status(200).json({
    message: `You accepted ${followerUsername}'s follow request!`,
    follow: followRecord,
  });
}

async function rejectFollowController(req, res) {
  const followeeUsername = req.user.username;
  const followerUsername = req.params.username;

  const followRecord = await followModel.findOneAndUpdate(
    { follower: followerUsername, followee: followeeUsername },
    { status: "rejected" },
    { new: true }
  );

  if (!followRecord) {
    return res.status(404).json({
      message: "Follow request not found!",
    });
  }

  res.status(200).json({
    message: `You rejected ${followerUsername}'s follow request!`,
    follow: followRecord,
  });
}



module.exports = {
  followUserController,
  unfollowUserController,
  acceptFollowController,
  rejectFollowController
};
