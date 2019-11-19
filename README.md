Sourcecode for https://speedtest.secwiz.io

The data is a data.json file keeps a frequent output of speedtest-cli in JSON format. All results are formated using jq
```
speedtest-cli --json >> output.json
cat output.json | jq -cr --slurp . > data.json
```


Hosted in docker using an nginx behind a traefik and ACME for certificates.
