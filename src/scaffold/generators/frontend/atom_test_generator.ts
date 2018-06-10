/** @module Scaffold */
import { Class } from '../'

export function AtomTestGenerator(name: string) {
  const gen = new Class('Test', `AtomTest<${name}>`)
  gen.addDecorator('suite', `'Unit::Frontend::Atoms::${name}'`)

  gen.addNamedImports('@seagull/core', ['Atom, AtomTest'])
  gen.addNamedImports('chai/register-should', [])
  gen.addNamedImports('mocha-typescript', ['suite', 'test'])
  gen.addDefaultImport('../../../frontend/atoms', name)

  gen.addProp({ name: 'atom', type: 'Atom', value: name })

  gen.addMethod({
    body: `this.html({}).should.be.equal('<div>replace me!</div>')`,
    decorator: { name: 'test' },
    // tslint:disable-next-line:quotemark
    name: "'returns html'",
    parameter: [],
    returnType: undefined,
  })
  return gen
}