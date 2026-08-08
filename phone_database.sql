-- ============================================================
--  OZONE PHONE - Database Tables
--  Adauga aceste tabele in baza ta de date dunko
-- ============================================================

-- Contacte salvate pe telefon
CREATE TABLE IF NOT EXISTS phone_contacts (
  id int(11) NOT NULL AUTO_INCREMENT,
  owner_id int(11) NOT NULL,
  
ame varchar(100) NOT NULL,
  
umber varchar(20) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  KEY owner_id (owner_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Mesaje SMS intre jucatori
CREATE TABLE IF NOT EXISTS phone_messages (
  id int(11) NOT NULL AUTO_INCREMENT,
  sender_id int(11) NOT NULL,
  eceiver_number varchar(20) NOT NULL,
  message text NOT NULL,
  is_read tinyint(1) NOT NULL DEFAULT 0,
  sent_at timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  KEY sender_id (sender_id),
  KEY eceiver_number (eceiver_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Istoric apeluri (Recente)
CREATE TABLE IF NOT EXISTS phone_calls (
  id int(11) NOT NULL AUTO_INCREMENT,
  caller_id int(11) NOT NULL,
  eceiver_id int(11) NOT NULL,
  caller_number varchar(20) NOT NULL,
  eceiver_number varchar(20) NOT NULL,
  status enum('answered','missed','rejected') NOT NULL DEFAULT 'missed',
  duration int(11) NOT NULL DEFAULT 0,
  called_at timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  KEY caller_id (caller_id),
  KEY eceiver_id (eceiver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Setari telefon per jucator (wallpaper ales, setup facut)
CREATE TABLE IF NOT EXISTS phone_settings (
  user_id int(11) NOT NULL,
  wallpaper varchar(50) NOT NULL DEFAULT 'deep-purple',
  setup_done tinyint(1) NOT NULL DEFAULT 0,
  operator varchar(50) NOT NULL DEFAULT 'Orange 5G',
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;