
function escapeRegexp(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/* TODO rename to Topic */
export class TagEntry {
  logo: string;
  id: string

  // TODO: introduce a separate TopicMetaData or TopicPages class. Will be easier to put it in a separate firebase location.
  // TODO: website
  // TODO: npm page
  // TODO: github page
  // TODO: twitter page/handle (could be useful to filter/auto-generate News)
  // TODO: stackSharePage, e.g. https://stackshare.io/angular-2

  constructor(
    public name: string,
    // public topicId?,
    logo?: string,
    public website?: string,
  ) {
    this.id = name // TODO escape e.g. + (For c++)
    if ( logo === null ) {
      this.logo = null;
    } else if ( logo === undefined ) {
      this.logo = this.getLogoPath(name);
    } else {
      this.logo = this.getLogoPath(logo);
    }
    if ( this.website === undefined ) {
      this.website = null // for firebase, because it does not allow to save undefined
    }
  }

  public getLogoPath(tag: string){
    // return '../../../assets/images/logos/' + tag.toLowerCase() + '-icon.svg'
    return '../../../assets/images/logos/' + tag.toLowerCase().replace(/ /g, '-') + '.svg'
  }

  matchesTextFilter(filterString: string) {
    if ( ! filterString ) {
      return true;
    }
    filterString = escapeRegexp(filterString)
    // return this.name.toLowerCase().indexOf(filterString.toLowerCase()) === 0;
    return this.name.toLowerCase().match(filterString.toLowerCase());
  }



}
