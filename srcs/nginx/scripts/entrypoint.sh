#! /bin/sh

INPUT_FILE="/etc/nginx/nginx.conf.template";
OUTPUT_FILE="/etc/nginx/nginx.conf";

REQUIRED_ENV_VARS="DOMAIN_NAME";
NOT_SET_ENV_VARS="";

echo "[i] Generating environment variable substitution command (with sed)"
JOINED_SEDS="";
for env_var_name in $REQUIRED_ENV_VARS; do
    env_var_value=$(printenv $env_var_name)

    if [ -z "$env_var_value" ]; then
	    NOT_SET_ENV_VARS="${NOT_SET_ENV_VARS}${env_var_name}";
    else
        SED="sed -e \"s#\\\${${env_var_name}}#${env_var_value}#g\" ";
        if [ -z $JOINED_SEDS ]; then
            JOINED_SEDS="$SED";
        else
            JOINED_SEDS="$JOINED_SEDS \\\n$SED";
        fi
    fi
done

if [ -n "$NOT_SET_ENV_VARS" ]; then
    echo "[w] Missing environment variables: $NOT_SET_ENV_VARS"
    exit 1;
fi

echo "[i] Generating ${OUTPUT_FILE} by substituting environment variables from ${INPUT_FILE}";
eval "cat $INPUT_FILE | $JOINED_SEDS > $OUTPUT_FILE";

exec "$@"
