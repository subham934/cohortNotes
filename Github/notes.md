VCS=> to track what different changes  we made in code by multiple user at different time.


git=> version control system

-------------------------------------

Installing Git::


download Git:
https://git-scm.com/downloads

1. Git Installation:
- Download Git from the official website (https://git-scm.com/downloads).
- standalone installer.

AFTER installing , in cmd look "git --version"

git config --global user.name "Subham Dhar"
 
when someone opens their system , he needs to run the above 2 command, with the help of which we can identify the person.


------------------------------------
once we open the index.html with live server, with the help of git we can track the changes we have made, git by default dont track changes, if we need to track changes with the help of git we need to run a command :: git init

now, the file has a symbol U next to it. normally we have 3 symbols, U, M, A

U-> Untracked: in this state git doesnt track changes. agar koi changes honge toh git unko track aur manage nahi karega.

if we want to make sure that the changes are tracked we need to run a command ::
git add [filename]
if we type 'git add .' all the files will be tracked.

M-> Modified: in this state git track the changes. ager hum koi changes karenge toh git unko track karega.

A-> added/ Track: in this state git track the changes. ager hum koi changes karenge toh git unko track karega.

----------------------------------------

to commit we run a command ::
git commit -m "message"

after commit, if we make changes in the code we will get -M again, meaning there are changes which are not committed. so commit it we need to add that file again and commit it. 

---------------------------------------------------

now, we will create a git repository and upload it to the github. to do so ,we write as below in terminal.

git remote add origin https://github.com/subham934/git-commit.git
git branch -M main
git push -u origin main

=> so we have push our local repository to the github.


---------------------------------------------------------
with the help of git clone , user2 can access this repository and can make changes.

=> here, we will clone the git repository of subham.

git clone https://github.com/subham934/git-commit.git

=> so in another folder , i've cloned it 

so now, we will make changes and we need to push it to the remote as user 1.

git add .
git commit -m "changes by user1"
git push origin main

if user2 has to get the new commit details , he need to pull the data


now add collaborator to this repo:
settings->collaborators and teams-> add people-> enter subham934

now i'll get a mail and after accepting it , i can access this repo.

-----------------------------------------
