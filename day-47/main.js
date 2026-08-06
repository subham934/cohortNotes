// var arr = [10, 20, 30, 40, 50]

// console.log(arr);

// =============================

// var arr = [
//     {
//         user: "sarthak",
//         age: 28,
//         city: "Bhopal",
//     },
//     {
//         user: "Ritik",
//         age: 27,
//         city: "Mumbai",
//     },
//     {
//         user: "Vivek",
//         age: 20,
//         city: "Las Vegas",
//     },
//     {
//         user: "Tanu",
//         age: 38,
//         city: "Bangalore",
//     },
// ]

// console.log(arr[0]);
// console.log(arr[0]['user']);
// console.log(arr[2].user);

// ================================

// var arr1 = [10, 20, 30, 40, 50]

// var sum = 0;
// arr1.forEach((elem)=>{
//     sum += elem;
//     console.log(elem);
//     console.log('hello');

// })

// console.log(sum);

// ==========================

// var arr = [
//     {
//         user: "sarthak",
//         age: 28,
//         city: "Bhopal",
//     },
//     {
//         user: "Ritik",
//         age: 27,
//         city: "Mumbai",
//     },
//     {
//         user: "Vivek",
//         age: 20,
//         city: "Las Vegas",
//     },
//     {
//         user: "Tanu",
//         age: 38,
//         city: "Bangalore",
//     },
// ]

// var sum = 0;

// arr.forEach(element => {
//    sum += element.age;
//    console.log(element.user);
// });

// console.log(sum);

// ==========================

const users = [
  {
    username: "Aarav Sharma",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    profession: "Frontend Developer",
    description:
      "Passionate about building clean UI and smooth user experiences with modern web technologies.",
    tags: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    username: "Ananya Verma",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    profession: "UI/UX Designer",
    description:
      "Designing intuitive interfaces and meaningful digital experiences for users.",
    tags: ["Figma", "Adobe XD", "UI Design", "UX Research"],
  },
  {
    username: "Rohan Das",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    profession: "Backend Developer",
    description:
      "Loves building scalable APIs and working with databases and server-side logic.",
    tags: ["Node.js", "Express", "MongoDB", "APIs"],
  },
  {
    username: "Sneha Kapoor",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    profession: "Digital Marketer",
    description:
      "Helping brands grow online through SEO, content marketing, and analytics.",
    tags: ["SEO", "Content", "Marketing", "Analytics"],
  },
  {
    username: "Arjun Mehta",
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
    profession: "Data Analyst",
    description:
      "Turning raw data into actionable insights using data visualization and statistics.",
    tags: ["Python", "Data Analysis", "SQL", "Power BI"],
  },
];

var sum = "";
users.forEach((elem) => {
  // console.log(elem.username);
  sum =
    sum +
    `    <div class="card">
        <img src=${elem.image} alt="">
        <h3>${elem.username}</h3>
        <h4>${elem.profession}</h4>
        <p>${elem.description}</p>

    </div>
`;
});

var main = document.querySelector("main");

main.innerHTML = sum;
