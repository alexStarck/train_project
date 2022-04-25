module.exports = {
  apps : [{
    name: "Backend",
    script: "npm run server",
    autorestart:true,
    watch:true,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  },{
    name: "Frontend",
    script: "npm run start --prefix client",
    autorestart:true,
    watch:true,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  },{
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
