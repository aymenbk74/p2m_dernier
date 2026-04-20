import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

# Build connection URL
user = os.getenv("DB_USER", "postgres")
pw = os.getenv("DB_PASSWORD", "admin")
host = os.getenv("DB_HOST", "localhost")
db_name = os.getenv("DB_NAME", "smart_db")
port = os.getenv("DB_PORT", "5432")

url = f"postgresql://{user}:{pw}@{host}:{port}/{db_name}"
engine = create_engine(url)

with engine.connect() as conn:
    print("Checking for seasonal_forecast alerts...")
    res = conn.execute(text("SELECT id, product_name, alert_type, metadata_info FROM inventory_alerts WHERE alert_type = 'seasonal_forecast'"))
    rows = res.fetchall()
    
    if not rows:
        print("❌ AUCUNE ALERTE SAISONNIÈRE TROUVÉE DANS LA BASE DE DONNÉES.")
    else:
        print(f"✅ {len(rows)} ALERTE(S) TROUVÉE(S) :")
        for r in rows:
            print(f"- ID: {r.id} | Titre: {r.product_name}")
            print(f"  Détails: {r.metadata_info}")
