const Proposal = require('./')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.should()
chai.use(chaiAsPromised)

describe('proposal', () => {
  let proposal
  let proposalEncoding
  
  const expiration = 2294967296
  const type = 4
  const description = 'Should we jump off this bridge?'
  const choices = ['Abstain', 'Yes', 'No']
  
  it('should create', () => {
    proposal = new Proposal(type, expiration, description, choices)
  })
  
  it('should encode', () => {
    return proposal.encode().then((_proposalEncoding) => {
      proposalEncoding = _proposalEncoding
    })
  })
  
  it('should fromEncoding', () => {
    return Proposal.fromEncoding(proposalEncoding).then((proposal) => {
      proposal.type.should.equal(type)
      proposal.expiration.should.equal(expiration)
      proposal.description.should.equal(description)
      proposal.choices.should.deep.equal(choices)
    })
  })
})