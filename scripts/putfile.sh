cd `dirname $0`
curl -X PUT -d @tile.json --header "Content-Type:application/json" http://localhost:3000/location/test/3,3
