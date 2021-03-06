import { Builder, WebDriver, By } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/ie'
import { resolve, join } from 'path'

describe('ie 11', () => {
  
  let driver: WebDriver

  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser('internet explorer')
      .setIeOptions(new Options())
      .build()
  }, 10000)

  afterAll(async () => {
    await driver.quit()
  }, 10000)

  test('browser tests', async () => {
    const path = resolve(join(__dirname, 'test-ie.html'))
    await driver.get('file://' + path)
    const element = await driver.findElement(By.id('test-result'))
    return expect(element.getText()).resolves.toBe('PASS')
  }, 10000)

})
