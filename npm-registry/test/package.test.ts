import * as getPort from 'get-port';
import got from 'got';
import { Server } from 'http';
import { createApp } from '../src/app';

describe('/package/:name/:version endpoint', () => {
  let server: Server;
  let port: number;

  beforeAll(async (done) => {
    port = await getPort();
    server = createApp().listen(port, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('responds', async () => {
    const packageName = 'react';
    const packageVersion = '16.13.0';

    const res: any = await got(
      `http://localhost:${port}/package/${packageName}/${packageVersion}`,
    ).json();

    expect(res.name).toEqual(packageName);
  });

  it('returns dependencies', async () => {
    const packageName = 'react';
    const packageVersion = '16.13.0';

    const res: any = await got(
      `http://localhost:${port}/package/${packageName}/${packageVersion}`,
    ).json();

    expect(res.dependencies).toEqual({
      'loose-envify': '^1.1.0',
      'object-assign': '^4.1.1',
      'prop-types': '^15.6.2',
    });
  });
  it('returns transitive dependencies', async () => {
    const packageName = 'react';
    const packageVersion = '16.13.0';

    const res: any = await got(
      `http://localhost:${port}/package/${packageName}/${packageVersion}`,
    ).json();

    expect(res.transitiveDependencies).toEqual([
      {
        "name": "loose-envify",
        "version": "1.1.0",
        "dependencies": {
          "js-tokens": {
            "name": "js-tokens",
            "version": "1.0.1"
          }
        }
      },
      {
        
      },
      {
        "name": "prop-types",
        "version": "15.6.2",
        "dependencies": {
          "loose-envify": {
            "name": "loose-envify",
            "version": "1.3.1",
            "dependencies": {
              "js-tokens": {
                "name": "js-tokens",
                "version": "3.0.0"
              }
            }
          },
          "object-assign": {
            "name": "object-assign",
            "version": "4.1.1"
          }
        }
      }
    ]);
  });
});
