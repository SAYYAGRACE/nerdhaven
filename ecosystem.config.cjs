module.exports = {
  apps: [
    {
      name: "nerdhaven",
      script: "server.js",
      cwd: "/opt/nerdhaven",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_file: "/opt/nerdhaven/.env.production",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "1G",
      restart_delay: 3000,
      max_restarts: 10,
      error_file: "/var/log/nerdhaven/error.log",
      out_file: "/var/log/nerdhaven/out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
