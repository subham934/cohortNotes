const iplTeams = [
  {
    team: "Chennai Super Kings",
    shortName: "CSK",
    primaryColor: "Yellow",
    secondaryColor: "Blue",
    captain: "MS Dhoni",
    trophies: 5
  },
  {
    team: "Mumbai Indians",
    shortName: "MI",
    primaryColor: "Blue",
    secondaryColor: "Gold",
    captain: "Hardik Pandya",
    trophies: 5
  },
  {
    team: "Kolkata Knight Riders",
    shortName: "KKR",
    primaryColor: "Purple",
    secondaryColor: "Gold",
    captain: "Shreyas Iyer",
    trophies: 3
  },
  {
    team: "Rajasthan Royals",
    shortName: "RR",
    primaryColor: "Pink",
    secondaryColor: "Blue",
    captain: "Sanju Samson",
    trophies: 1
  },
  {
    team: "Royal Challengers Bengaluru",
    shortName: "RCB",
    primaryColor: "Red",
    secondaryColor: "Black",
    captain: "Faf du Plessis",
    trophies: 0
  },
  {
    team: "Sunrisers Hyderabad",
    shortName: "SRH",
    primaryColor: "Orange",
    secondaryColor: "Black",
    captain: "Pat Cummins",
    trophies: 1
  },
  {
    team: "Delhi Capitals",
    shortName: "DC",
    primaryColor: "Blue",
    secondaryColor: "Red",
    captain: "Rishabh Pant",
    trophies: 0
  },
  {
    team: "Punjab Kings",
    shortName: "PBKS",
    primaryColor: "Red",
    secondaryColor: "silver",
    captain: "Shikhar Dhawan",
    trophies: 0
  },
  {
    team: "Gujarat Titans",
    shortName: "GT",
    primaryColor: "darkblue",
    secondaryColor: "Gold",
    captain: "Shubman Gill",
    trophies: 1
  },
  {
    team: "Lucknow Super Giants",
    shortName: "LSG",
    primaryColor: "lightblue",
    secondaryColor: "Orange",
    captain: "KL Rahul",
    trophies: 0
  }
];


var btn = document.querySelector("button");
var h1 = document.querySelector("h1");
var h2 = document.querySelector("h2");
var p = document.querySelector("p");
var main = document.querySelector("main");
var card = document.querySelector(".card")


btn.addEventListener("click", function () {
  var winner = iplTeams[Math.floor(Math.random() * iplTeams.length)];

  // change text
  h1.innerHTML = winner.team;
  h2.innerHTML = `Trophies: ${winner.trophies}`;
  p.innerHTML = `Captain: ${winner.captain}`

  // change colors
  h1.style.color = winner.primaryColor;
  h2.style.color = winner.primaryColor;
  p.style.color = winner.primaryColor;
  card.style.backgroundColor = winner.secondaryColor
  main.style.backgroundColor = winner.primaryColor;

});


