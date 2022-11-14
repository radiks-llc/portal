const fetchStringFromEnv = (key: string, value: string): string => {
  if (value === undefined || value === "") {
    console.warn(`Environment variable ${value} is not defined`);
    return "";
  }

  return value.toString();
};

export default {
  mitchPass: fetchStringFromEnv("MITCH_PASS", import.meta.env.MITCH_PASS),
  dbUrl: fetchStringFromEnv("DATABASE_URL", import.meta.env.DATABASE_URL),
  astroUrl: fetchStringFromEnv("ASTROAUTH_URL", import.meta.env.ASTROAUTH_URL),
  astroSecret: fetchStringFromEnv(
    "ASTROAUTH_SECRET",
    import.meta.env.ASTROAUTH_SECRET
  ),
};
