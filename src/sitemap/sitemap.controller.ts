import { Controller, Get, Header, Injectable } from '@nestjs/common';
import { TopPageService } from 'src/top-page/top-page.service';
import { ConfigService } from '@nestjs/config';
import { subDays, format } from 'date-fns';
import { Builder } from 'xml2js';
import { CATEGORY_URL } from './sitemap.contants';

@Controller('sitemap')
export class SitemapController {
  domain: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly topPageService: TopPageService,
  ) {
    this.domain = this.configService.get('DOMAIN') ?? '';
  }

  @Get('xml')
  @Header('content-type', 'text/xml')
  async sitemap() {
    const formatString = "yyyy-MM-dd'T'HH:mm:00.000xxx";
    let res = [
      {
        location: this.domain,
        lastmod: format(subDays(new Date(), 1), formatString),
        changefreq: 'daily',
        priority: '1.0',
      },
      {
        location: `${this.domain}/courses`,
        lastmod: format(subDays(new Date(), 1), formatString),
        changefreq: 'daily',
        priority: '1.0',
      },
    ];

    const pages = await this.topPageService.findAll();
    res = res.concat(
      pages.map((page) => {
        return {
          location: `${this.domain}${CATEGORY_URL[page.firstCategory]}/${page.alias}`,
          lastmod: format(new Date(page.updatedAt ?? new Date()), formatString),
          changefreq: 'weekly',
          priority: '0.7',
        };
      }),
    );

    const builder = new Builder({
      xmldec: {
        version: '1.0',
        encoding: 'UTF-8',
      },
    });

    return builder.buildObject({
      urlset: {
        $: {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        },
        url: res,
      },
    });
  }
}
