# Generated by Django 2.2.16 on 2020-10-25 07:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('scraper', '0003_auto_20200502_1327'),
    ]

    operations = [
        migrations.AlterField(
            model_name='meeting',
            name='section',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='meetings', to='scraper.Section'),
        ),
    ]