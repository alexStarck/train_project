module.exports = {
  apps : [{
    name: "Admin Frontend",
    script: "npm run adminka",
    autorestart:false,
    watch:true,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
