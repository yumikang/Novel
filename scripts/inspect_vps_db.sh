#!/bin/bash

# VPS Connection Info
VPS_HOST="root@141.164.60.51"

echo "Connecting to VPS ($VPS_HOST) to inspect database containers..."
echo "=============================================================================="

ssh $VPS_HOST '
    echo "VPS Hostname: $(hostname)"
    echo "Date: $(date)"
    echo "=============================================================================="
    printf "%-25s %-20s %-30s %-20s\n" "CONTAINER NAME" "IMAGE" "PORTS" "STATUS"
    echo "------------------------------------------------------------------------------"
    
    # Find containers that look like databases
    DB_CONTAINERS=$(podman ps -a --format "{{.Names}}" | grep -E "postgres|mysql|mariadb|redis|mongo")
    
    if [ -z "$DB_CONTAINERS" ]; then
        echo "No obvious database containers found (searching for postgres, mysql, mariadb, redis, mongo)."
    else
        for container in $DB_CONTAINERS; do
            # Get basic info
            INFO=$(podman ps -a --filter name=$container --format "{{.Names}}|{{.Image}}|{{.Ports}}|{{.Status}}")
            NAME=$(echo $INFO | cut -d"|" -f1)
            IMAGE=$(echo $INFO | cut -d"|" -f2)
            PORTS=$(echo $INFO | cut -d"|" -f3)
            STATUS=$(echo $INFO | cut -d"|" -f4)
            
            printf "%-25s %-20s %-30s %-20s\n" "$NAME" "${IMAGE:0:20}" "${PORTS:0:30}" "$STATUS"
        done
    fi
    
    echo "=============================================================================="
    echo "STORAGE & VOLUME DETAILS"
    echo "=============================================================================="
    
    if [ -n "$DB_CONTAINERS" ]; then
        for container in $DB_CONTAINERS; do
            echo "[ Container: $container ]"
            
            # Inspect mounts
            # We use a custom template to format mount info
            podman inspect $container --format "{{ range .Mounts }}Type: {{.Type}} | Source: {{.Source}} | Dest: {{.Destination}}{{println}}{{end}}" | while read mount; do
                echo "  - $mount"
                
                # Extract Source path to check size
                SOURCE=$(echo "$mount" | awk -F"Source: " "{print \$2}" | awk -F" |" "{print \$1}")
                
                if [ -n "$SOURCE" ]; then
                    if [ -e "$SOURCE" ]; then
                        SIZE=$(du -sh "$SOURCE" 2>/dev/null | cut -f1)
                        echo "    -> Disk Usage: $SIZE"
                    else
                        echo "    -> Source path not accessible or does not exist on host."
                    fi
                fi
            done
            echo "------------------------------------------------------------------------------"
        done
    fi
'
