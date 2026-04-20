import os
from sqlalchemy import create_engine
from dotenv import load_dotenv
from database import Base
import models # Important to import so models are registered with Base

load_dotenv()

# Build connection URL
user = os.getenv("DB_USER", "postgres")
pw = os.getenv("DB_PASSWORD", "admin")
host = os.getenv("DB_HOST", "localhost")
db_name = os.getenv("DB_NAME", "smart_db")
port = os.getenv("DB_PORT", "5432")

url = f"postgresql://{user}:{pw}@{host}:{port}/{db_name}"
engine = create_engine(url)

if __name__ == "__main__":
    print(f"📡 Connecting to {url}...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database schema updated (SeasonalEvent table created if missing).")
