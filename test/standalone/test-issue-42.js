
var http = require('http')
  , multiparty = require('../../')
  , assert = require('assert')
  , superagent = require('superagent')
  , path = require('path')

var server = http.createServer(function(req, res) {
  assert.strictEqual(req.url, '/upload');
  assert.strictEqual(req.method, 'POST');

  var form = new multiparty.Form()
  var parts = []

  form.on('part', function (part) {
    parts.push(part)
  })

  form.on('error', console.error)

  form.on('close', function () {
    assert.ok(true, 'expect to get here')
    assert.equal(parts.length, 2, 'expect 2 parts')
    res.end()
  })

  form.parse(req)
});

server.listen(function() {
  var url = 'http://localhost:' + server.address().port + '/upload';
  var req = superagent.post(url);
  req.attach('files[]', fixture('pf1y5.png'), 'SOG2.JPG');
  req.attach('files[]', fixture('binaryfile.tar.gz'), 'BenF364_LIB353.zip');
  req.end(function(err, resp) {
    assert.ifError(err);
    resp.on('end', function() {
      server.close();
    });
  });
});
function fixture(name) {
  return path.join(__dirname, '..', 'fixture', 'file', name)
}
