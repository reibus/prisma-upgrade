import { Prompt } from '../prompter'
import * as api from '../api'
import { bold } from 'kleur'
import P1 from '../prisma1'
import P2 from '../prisma2'
import path from 'path'
import util from 'util'
import arg from 'arg'
import fs from 'fs'

/**
 * Constants
 */

const exists = util.promisify(fs.exists)
const readFile = util.promisify(fs.readFile)
const cwd = process.cwd()

/**
 * Flags
 */

const flags = {
  // chdir
  '--chdir': String,
  '-C': '--chdir',

  // help
  '--help': Boolean,
  '-h': '--help',

  // version
  '--version': Boolean,
}

function usage() {
  return `
  ${bold('prisma-upgrade')} helps you transition from Prisma 1 to Prisma 2.

  ${bold('Usage')}

    prisma-upgrade [flags] <datamodel.graphql> <schema.prisma>

  ${bold('Flags')}

    -C, --chdir          Change the working directory.
    -h, --help           Output usage information.
        --version        Show the version.
  `
}

async function main(argv: string[]): Promise<void> {
  const args = arg(flags, { argv: argv, permissive: true })

  // print help
  if (args['--help']) {
    console.log(usage())
    return
  }

  // print the version
  if (args['--version']) {
    console.log(require('../package.json').version)
    return
  }

  const params = args._.slice(2)
  if (params.length < 2) {
    console.error(usage())
    process.exit(1)
  }

  // change the working directory
  const wd = args['--chdir'] ? path.resolve(cwd, args['--chdir']) : cwd
  const p1 = path.resolve(wd, params[0])
  const p2 = path.resolve(wd, params[1])
  if (!(await exists(p1))) {
    console.error(`[!] Prisma 1 Datamodel doesn't exist "${p1}"\n\n${usage()}`)
    process.exit(1)
  }
  if (!(await exists(p2))) {
    console.error(`[!] Prisma 2 Schema doesn't exist "${p2}"\n\n${usage()}`)
    process.exit(1)
  }

  const prisma1 = P1.parse(await readFile(p1, 'utf8'))
  const prisma2 = P2.parse(await readFile(p2, 'utf8'))

  await api.upgrade({
    prompter: new Prompt(),
    console: console,
    prisma1,
    prisma2,
  })

  return
}

/**
 * Run main
 */

main(process.argv).catch((err) => {
  console.error(err)
  process.exit(1)
})