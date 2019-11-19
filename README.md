Sourcecode for https://speedtest.secwiz.io

The data is a data.json file which is the output of;
```
speedtest-cli --json | jq -cr --slurp .
```


Hosted in docker using an nginx behind a traefik and ACME for certificates.
