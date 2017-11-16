const defunction = require('defunction')
const protobuf = require('protobufjs')
const Promise = require('bluebird')

const protofilePath = './ethereum-community-proposal.proto'

let proposalEncoder

function getEncoder() {
  if (proposalEncoder) {
    return Promise.resolve(proposalEncoder)
  }
  return new Promise((resolve, reject) => {
    protobuf.load(protofilePath, (err, root) => {
      if (err) {
        reject(err)
      } else {
        resolve(root.lookupType('Proposal'))
      }
    })
  })
}

const Proposal = module.exports = defunction(['number', 'number', 'string', '[]string'], '*', function Proposal(type, expiration, description, choices) {
  this.type = type
  this.expiration = expiration
  this.description = description
  this.choices = choices
})

Proposal.prototype.encode = defunction([], '=>Buffer', function encode() {
  return getEncoder().then((encoder) => {
    return encoder.encode({
      version: 0,
      type: this.type,
      expiration: this.expiration,
      description: this.description,
      choices: this.choices
    }).finish()
  })
})

Proposal.fromEncoding = defunction(['Buffer'], '=>Proposal', function fromEncoding(encoding) {
  return getEncoder().then((encoder) => {
    const pojo = encoder.decode(encoding)
    return new Proposal(pojo.type, pojo.expiration, pojo.description, pojo.choices)
  })
})
