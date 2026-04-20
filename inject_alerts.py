import os

file_path = 'frontend/src/components/AdminDashboard.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Ensure AILuxuryAlerts is imported
import_line = "import { AILuxuryAlerts } from './AILuxuryAlerts';\n"
if not any("from './AILuxuryAlerts'" in line for line in lines):
    for i, line in enumerate(lines):
        if line.startswith("import React"):
            lines.insert(i + 1, import_line)
            break

# Find the activeTab === 'alerts' && ( block
start_idx = -1
for i, line in enumerate(lines):
    if "activeTab === 'alerts' && (" in line:
        start_idx = i - 1  # Get the opening {
        break

if start_idx != -1:
    end_idx = start_idx
    brace_count = 0
    for i in range(start_idx, len(lines)):
        brace_count += lines[i].count('{')
        brace_count -= lines[i].count('}')
        if brace_count == 0 and i > start_idx:
            end_idx = i
            break
            
    # Replace the block
    new_block = [
        "                    {\n",
        "                        activeTab === 'alerts' && (\n",
        "                            <div style={{ height: '75vh', overflow: 'hidden' }}>\n",
        "                                <AILuxuryAlerts alerts={alerts} markAllAlertsAsRead={markAllAlertsAsRead} fetchAlerts={fetchAlerts} unreadCount={unreadCount} markAlertAsRead={markAlertAsRead} setSelectedProductId={setSelectedProductId} />\n",
        "                            </div>\n",
        "                        )\n",
        "                    }\n"
    ]
    
    # Replace the section
    lines[start_idx:end_idx+1] = new_block

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Updated AdminDashboard successfully via Python!")
