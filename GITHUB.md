- Initialize Git repository:

  git init
  git add .
  git commit -m "first commit"
  git branch -M main
  git remote add origin https://github.com/rick-sundayai/blogplatform.git
  git push -u origin main
  
  Push to github
  git add .
  git commit -m ".... commit"
  git push -u origin main

  Reverting to Github Repo
  git fetch origin main
  git reset --hard origin/main
  git clean -fd