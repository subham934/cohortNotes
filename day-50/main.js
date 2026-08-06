var elems = document.querySelectorAll(".elem");

// console.log(elems[0]);
// console.log(elems[1]);
// console.log(elems[2]);

// elems.forEach((elem) => {
//   //   console.log(elem.innerHTML);
//   //   console.log("hello");
//   // console.log(elem);
//   // console.log(elem.childNodes[0]);
//   // console.log(elem.childNodes[1]);
//   // console.log(elem.childNodes[3]);
//   elem.childNodes[3].addEventListener('click', function(){
//     console.log(`Hello`); // clicking on any button gives Hello
//   });
// });

// var allBtn = document.querySelectorAll("button");

// allBtn.forEach((elem) => {
//   elem.addEventListener("click", function () {
//     // console.log("button clicked");
//     // elem.innerHTML = 'Remove Friend';

//     if(elem.innerHTML == "Add Friend"){
//         elem.innerHTML = "Remove Friend"
//     }else{
//         elem.innerHTML = 'Add Friend'
//     }
//   });
// });

// =================================


// Difference between forEach() and map() in JavaScript

// Both forEach() and map() are array methods used to iterate over elements, but their purpose and return behavior are different.

// Core difference (in one line)

// forEach() → used to do something with each item (side effects), returns nothing

// map() → used to transform data, returns a new array

// forEach()

// Executes a function for each element

// Does NOT return a new array (returns undefined)

// Used when you want to log, update DOM, modify external variables, etc.


// const nums = [1, 2, 3];

// nums.forEach(num => {
//   console.log(num * 2);
// });




// map()

// Executes a function for each element

// Returns a new array with transformed values

// Does not mutate the original array

// const nums = [1, 2, 3];

// const doubled = nums.map(num => num * 2);
// console.log(doubled); // [2, 4, 6]


// ✅ Best for: data transformation
// ❌ Not for: just logging or side effects

// ==============================

const reels = [
  {
    username: "john_doe",
    likeCount: 1240,
    isLiked: true,
    commentCount: 98,
    caption: "Morning vibes 🌅",
    video: "./video/vi1.mp4",
    userprofile: "https://example.com/profiles/john.jpg",
    shareCount: 45,
    isFollowed: true
  },
  {
    username: "travel_with_amy",
    likeCount: 9876,
    isLiked: false,
    commentCount: 432,
    caption: "Lost in the mountains 🏔️",
    video: "./video/vi2.mp4",
    userprofile: "https://example.com/profiles/amy.jpg",
    shareCount: 321,
    isFollowed: false
  },
  {
    username: "code_guy",
    likeCount: 560,
    isLiked: false,
    commentCount: 34,
    caption: "Debugging at 2 AM 💻",
    video: "./video/vi3.mp4",
    userprofile: "https://example.com/profiles/codeguy.jpg",
    shareCount: 12,
    isFollowed: true
  },
  {
    username: "fitness_freak",
    likeCount: 4521,
    isLiked: true,
    commentCount: 210,
    caption: "No excuses. Just results 💪",
    video: "./video/vi4.mp4",
    userprofile: "https://example.com/profiles/fitness.jpg",
    shareCount: 180,
    isFollowed: true
  },
  {
    username: "foodie_diaries",
    likeCount: 8340,
    isLiked: true,
    commentCount: 654,
    caption: "Cheese makes everything better 🧀",
    video: "./video/vi5.mp4",
    userprofile: "https://example.com/profiles/foodie.jpg",
    shareCount: 490,
    isFollowed: false
  },
  {
    username: "street_photog",
    likeCount: 1290,
    isLiked: false,
    commentCount: 76,
    caption: "Every street has a story 📸",
    video: "./video/vi6.mp4",
    userprofile: "https://example.com/profiles/street.jpg",
    shareCount: 33,
    isFollowed: false
  },
  {
    username: "music_lover",
    likeCount: 6723,
    isLiked: true,
    commentCount: 389,
    caption: "Headphones on, world off 🎧",
    video: "./video/vi7.mp4",
    userprofile: "https://example.com/profiles/music.jpg",
    shareCount: 270,
    isFollowed: true
  },
  {
    username: "daily_quotes",
    likeCount: 3450,
    isLiked: false,
    commentCount: 120,
    caption: "Consistency beats motivation ✨",
    video: "./video/vi8.mp4",
    userprofile: "https://example.com/profiles/quotes.jpg",
    shareCount: 155,
    isFollowed: false
  },
  {
    username: "gamer_x",
    likeCount: 9112,
    isLiked: true,
    commentCount: 540,
    caption: "One more game before sleep 🎮",
    video: "./video/vi9.mp4",
    userprofile: "https://example.com/profiles/gamer.jpg",
    shareCount: 610,
    isFollowed: true
  },
  {
    username: "sunset_chaser",
    likeCount: 2580,
    isLiked: false,
    commentCount: 89,
    caption: "Chasing sunsets, not people 🌇",
    video: "./video/vi10.mp4",
    userprofile: "https://example.com/profiles/sunset.jpg",
    shareCount: 64,
    isFollowed: false
  }
];

var sum = "";

reels.forEach((elem)=>{
    
    sum = sum + `<div class="reel">
            <video autoplay loop muted src=${elem.video}></video>
            <div class="bottom">
              <div class="user">
                <img src=${elem.userprofile} alt="" />
                <h4>${elem.username}</h4>
                <button>${elem.isFollowed?"Unfollow":"Follow"}</button>
            </div>

            <h3>${elem.caption} </h3>
            </div>

            <div class="right">
                <div class="like">
                    <h4 class="like-icon">
                        ${elem.isLiked ? "<i class='ri-heart-3-fill love'></i>" : "<i class='ri-heart-3-line'></i>"}
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
            
          </div>`
    
})

var allReels = document.querySelector(".all-reels")

allReels.innerHTML = sum