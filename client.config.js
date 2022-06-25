module.exports = {
  apps : [{
    name: "client",
    script: "npm run start --prefix client",
    autorestart:true,
    watch:true
  }]
}
