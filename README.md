Sourcecode for https://speedtest.secwiz.io

# Setup your config
Select which servers to run with speedtest-cli. You can view which IDs are available using `--list`
```
./speedtest-cli --list | grep -i norw | egrep "(ITsjefen|Telenor Norge AS|Altibox AS \(Oslo|Get AS|Broadnet)" 
```

Update the `config.json` accordingly
```
{
  "binary":"/usr/local/bin/speedtest-cli",
  "output":"data.json",
  "servers": [
    "1252",
    "11787",
    "13544",
    "12919",
    "11786",
    "25057"
  ]
}
```

# Run your tests

Run the tests to update `data.json`
```
bash test.sh
```

# Hosting

Hosted this folder statically on your webserver. E.g. in docker using an nginx behind a traefik and ACME for certificates.
