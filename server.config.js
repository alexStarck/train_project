module.exports = {
  apps : [{
    name: "Backend",
    script: "npm run start --prefix server",
    autorestart:true,
    watch:true
  }]
}
