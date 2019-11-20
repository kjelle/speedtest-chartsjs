Sourcecode for https://speedtest.secwiz.io

# Build your server list
Select which servers to run with speedtest-cli. The run script will handle the output from `--list`:
```
./speedtest-cli --list | grep -i norw | egrep "(ITsjefen|Telenor Norge AS|Altibox AS \(Oslo|Get AS|Broadnet)" > server_list
```

# Update your own domain


The data is a data.json file keeps a frequent output of speedtest-cli in JSON format. All results are formated using jq
```
speedtest-cli --json >> output.json
cat output.json | jq -cr --slurp . > data.json
```


Hosted in docker using an nginx behind a traefik and ACME for certificates.
