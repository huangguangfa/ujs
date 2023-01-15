import { promises as dns } from 'node:dns'
import os from 'node:os'
import chalk from 'chalk'
import stripAnsi from 'strip-ansi'

import { wildcardHosts } from '../common/constants'

import type { HttpServer, ResolvedServerUrls } from './index'
import type { AddressInfo } from 'node:net'
import type { UserConfigServer } from '../config'

export interface Hostname {
  host: string | undefined
  name: string
}
export async function resolveHostname(
  optionsHost: string | boolean | undefined
): Promise<Hostname> {
  let host: string | undefined
  if (optionsHost === undefined || optionsHost === false) {
    host = 'localhost'
  } else if (optionsHost === true) {
    // If passed --host in the CLI without arguments
    host = undefined // undefined typically means 0.0.0.0 or :: (listen on all IPs)
  } else {
    host = optionsHost
  }
  // Set host name to localhost when possible
  let name = host === undefined || wildcardHosts.has(host) ? 'localhost' : host
  if (host === 'localhost') {
    const localhostAddr = await getLocalhostAddressIfDiffersFromDNS()
    if (localhostAddr) {
      name = localhostAddr
    }
  }

  return { host, name }
}

export async function getLocalhostAddressIfDiffersFromDNS(): Promise<
  string | undefined
> {
  const [nodeResult, dnsResult] = await Promise.all([
    dns.lookup('localhost'),
    dns.lookup('localhost', { verbatim: true }),
  ])
  const isSame =
    nodeResult.family === dnsResult.family &&
    nodeResult.address === dnsResult.address
  return isSame ? undefined : nodeResult.address
}

export async function resolveServerUrls(
  server: HttpServer,
  options: UserConfigServer
): Promise<ResolvedServerUrls> {
  const address = server.address()
  const isAddressInfo = (x: any): x is AddressInfo => x?.address
  if (!isAddressInfo(address)) {
    return { local: [], network: [] }
  }

  const local: string[] = []
  const network: string[] = []
  const hostname = await resolveHostname(options.host)
  const protocol = options.https ? 'https' : 'http'
  const port = address.port
  const base = '/'

  Object.values(os.networkInterfaces())
    .flatMap((nInterface) => nInterface ?? [])
    .filter(
      (detail: any) =>
        detail &&
        detail.address &&
        // Node < v18
        ((typeof detail.family === 'string' && detail.family === 'IPv4') ||
          // Node >= v18
          (typeof detail.family === 'number' && detail.family === 4))
    )
    .forEach((detail) => {
      const host = detail.address.replace('127.0.0.1', hostname.name)
      const url = `${protocol}://${host}:${port}${base}`
      if (detail.address.includes('127.0.0.1')) {
        local.push(url)
      } else {
        network.push(url)
      }
    })
  return { local, network }
}

const BORDERS = {
  TL: chalk.gray.dim('╔'),
  TR: chalk.gray.dim('╗'),
  BL: chalk.gray.dim('╚'),
  BR: chalk.gray.dim('╝'),
  V: chalk.gray.dim('║'),
  H_PURE: '═',
}

export function getDevBanner(resolvedUrls: ResolvedServerUrls, offset = 10) {
  const { local, network } = resolvedUrls
  const header = ' App listening at:'
  const footer = chalk.bold(
    ' Now you can open browser with the above addresses↑ '
  )
  const _local = `  ${chalk.gray('>')}   Local: ${chalk.green(`${local[0]}`)} `
  const _network = `  ${chalk.gray('>')} Network: ${chalk.green(
    `${network[0]}`
  )}      `
  const maxLen = Math.max(
    ...[header, footer, _local, _network].map((x) => x.length)
  )

  // prepare all output lines
  const beforeLines = [
    `${BORDERS.TL}${chalk.gray.dim(''.padStart(maxLen, BORDERS.H_PURE))}${
      BORDERS.TR
    }`,
    `${BORDERS.V}${header}${''.padStart(maxLen - header.length)}${BORDERS.V}`,
    `${BORDERS.V}${_local}${''.padStart(maxLen - stripAnsi(_local).length)}${
      BORDERS.V
    }`,
  ]
  const mainLine = `${BORDERS.V}${_network}${''.padStart(
    maxLen - stripAnsi(_network).length
  )}${BORDERS.V}`
  const afterLines = [
    `${BORDERS.V}${''.padStart(maxLen)}${BORDERS.V}`,
    `${BORDERS.V}${footer}${''.padStart(maxLen - stripAnsi(footer).length)}${
      BORDERS.V
    }`,
    `${BORDERS.BL}${chalk.gray.dim(''.padStart(maxLen, BORDERS.H_PURE))}${
      BORDERS.BR
    }`,
  ]

  // join lines as 3 parts for vertical middle output with logger
  return {
    before: beforeLines.map((l) => l.padStart(l.length + offset)).join('\n'),
    main: mainLine,
    after: afterLines.map((l) => l.padStart(l.length + offset)).join('\n'),
  }
}
