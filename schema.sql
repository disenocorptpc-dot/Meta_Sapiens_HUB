-- Schema para Meta Sapiens HUB
-- Una tabla simple key/value mapea 1:1 con localStorage
-- sin cambiar la estructura de los componentes React

CREATE TABLE IF NOT EXISTS hub_data (
  key       TEXT PRIMARY KEY,
  value     TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
