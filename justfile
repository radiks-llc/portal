push-to-garfield:
  npm run build
  rsync dist/* mshynes@garfield.cs.mun.ca:~/.www/ -r
