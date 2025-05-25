import os
from alembic import context
from sqlalchemy import create_engine
from app.database import Base
from app.settings import settings
# Note: Import models to populate `Base.metadata`
from app.models import User, Product

config = context.config
engine = create_engine(settings.database_url)

def run_migrations_online():
    """Run migrations in online mode (synchronous)."""
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=Base.metadata, include_schemas=True)
        with context.begin_transaction():
            context.run_migrations()

run_migrations_online()
