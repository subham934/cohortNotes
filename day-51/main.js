const reels = [
  {
    ismuted: true,
    username: "john_doe",
    likeCount: 1240,
    isLiked: true,
    commentCount: 98,
    caption: "Morning vibes 🌅",
    video: "./video/vi1.mp4",
    userprofile: "https://example.com/profiles/john.jpg",
    shareCount: 45,
    isFollowed: true,
  },
  {
    ismuted: true,
    username: "travel_with_amy",
    likeCount: 9876,
    isLiked: false,
    commentCount: 432,
    caption: "Lost in the mountains 🏔️",
    video: "./video/vi2.mp4",
    userprofile: "https://example.com/profiles/amy.jpg",
    shareCount: 321,
    isFollowed: false,
  },
  {
    ismuted: true,
    username: "code_guy",
    likeCount: 560,
    isLiked: false,
    commentCount: 34,
    caption: "Debugging at 2 AM 💻",
    video: "./video/vi3.mp4",
    userprofile: "https://example.com/profiles/codeguy.jpg",
    shareCount: 12,
    isFollowed: true,
  },
  {
    ismuted: true,
    username: "fitness_freak",
    likeCount: 4521,
    isLiked: true,
    commentCount: 210,
    caption: "No excuses. Just results 💪",
    video: "./video/vi4.mp4",
    userprofile: "https://example.com/profiles/fitness.jpg",
    shareCount: 180,
    isFollowed: true,
  },
  {
    ismuted: true,
    username: "foodie_diaries",
    likeCount: 8340,
    isLiked: true,
    commentCount: 654,
    caption: "Cheese makes everything better 🧀",
    video: "./video/vi5.mp4",
    userprofile: "https://example.com/profiles/foodie.jpg",
    shareCount: 490,
    isFollowed: false,
  },
  {
    ismuted: true,
    username: "street_photog",
    likeCount: 1290,
    isLiked: false,
    commentCount: 76,
    caption: "Every street has a story 📸",
    video: "./video/vi6.mp4",
    userprofile: "https://example.com/profiles/street.jpg",
    shareCount: 33,
    isFollowed: false,
  },
  {
    ismuted: true,
    username: "music_lover",
    likeCount: 6723,
    isLiked: true,
    commentCount: 389,
    caption: "Headphones on, world off 🎧",
    video: "./video/vi7.mp4",
    userprofile: "https://example.com/profiles/music.jpg",
    shareCount: 270,
    isFollowed: true,
  },
  {
    ismuted: true,
    username: "daily_quotes",
    likeCount: 3450,
    isLiked: false,
    commentCount: 120,
    caption: "Consistency beats motivation ✨",
    video: "./video/vi8.mp4",
    userprofile: "https://example.com/profiles/quotes.jpg",
    shareCount: 155,
    isFollowed: false,
  },
  {
    ismuted: true,
    username: "gamer_x",
    likeCount: 9112,
    isLiked: true,
    commentCount: 540,
    caption: "One more game before sleep 🎮",
    video: "./video/vi9.mp4",
    userprofile: "https://example.com/profiles/gamer.jpg",
    shareCount: 610,
    isFollowed: true,
  },
  {
    ismuted: true,
    username: "sunset_chaser",
    likeCount: 2580,
    isLiked: false,
    commentCount: 89,
    caption: "Chasing sunsets, not people 🌇",
    video: "./video/vi10.mp4",
    userprofile: "https://example.com/profiles/sunset.jpg",
    shareCount: 64,
    isFollowed: false,
  },
];

var allReels = document.querySelector(".all-reels");

var isMuted = true;

function addData() {
  var sum = "";
  reels.forEach((elem, idx) => {
    sum =
      sum +
      `<div class="reel">
            <video autoplay loop ${elem.ismuted ? "muted" : ""} src=${
        elem.video
      }></video>
                    <div class="mute" id=${idx}>
                ${elem.ismuted?'<i class="ri-volume-mute-fill"></i>': '<i class="ri-volume-up-fill"></i>'}
        </div>
            <div class="bottom">
              <div class="user">
                <img src=${elem.userprofile} alt="" />
                <h4>${elem.username}</h4>
                <button id=${idx} class='follow'>${
        elem.isFollowed ? "Unfollow" : "Follow"
      }</button>
            </div>

            <h3>${elem.caption} </h3>
            </div>

            <div class="right">
                <div id=${idx}   class="like">
                    <h4 class="like-icon">
                        ${
                          elem.isLiked
                            ? "<i class='ri-heart-3-fill love'></i>"
                            : "<i class='ri-heart-3-line'></i>"
                        }
                    </h4>
                    <h6>${elem.likeCount}</h6>
                </div>
                <div class="comment">
                    <h4 class="comment-icon">
                        <i class="ri-chat-3-line"></i>
                    </h4>
                    <h6>${elem.commentCount}</h6>
                </div>

                <div class="share">
                    <h4 class="share-icon">
                        <i class="ri-share-forward-line"></i>
                    </h4>
                    <h6>${elem.shareCount}</h6>
                </div>

                <div class="menu">
                    <h4 class="menu-icon">
                        <i class="ri-more-2-fill"></i>
                    </h4>
                    <h6>88</h6>
                </div>
            </div>
            
          </div>`;
  });

  allReels.innerHTML = sum;
}

addData();

allReels.addEventListener("click", (dets) => {
  // if(!reels[dets.target.id].isLiked ){

  //     reels[dets.target.id].likeCount++;
  //     reels[dets.target.id].isLiked = true;
  // }else{
  //     reels[dets.target.id].likeCount--;
  //     reels[dets.target.id].isLiked = false;
  // }
  //   console.log(reels[dets.target.id].likeCount);

  if (dets.target.className === "like") {
    if (!reels[dets.target.id].isLiked) {
      reels[dets.target.id].likeCount++;
      reels[dets.target.id].isLiked = true;
    } else {
      reels[dets.target.id].likeCount--;
      reels[dets.target.id].isLiked = false;
    }
    addData();
  }

  if (dets.target.className === "follow") {
    if (!reels[dets.target.id].isFollowed) {
      reels[dets.target.id].isFollowed = true;
    } else {
      reels[dets.target.id].isFollowed = false;
    }
    addData();
  }

  if (dets.target.className === "mute") {
    if (!reels[dets.target.id].ismuted) {
      reels[dets.target.id].ismuted = true;
    } else {
      reels[dets.target.id].ismuted = false;
    }
    addData();
  }

  
});

// ======================================
// var ar = [10,29,30,40]
// ar.forEach(function(val, idx, arr){
//     console.log(val, idx, arr[idx]);
// })
// ======================================
