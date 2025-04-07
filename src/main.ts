/*import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from '@apollo/client/core';

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:5000/graphql' }),
  cache: new InMemoryCache(),
});

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideApolloClient(apolloClient)
  ]
}).catch(err => console.error(err));
function provideApolloClient(apolloClient: ApolloClient<NormalizedCacheObject>): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}

*/
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

export function apolloClientFactory(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: 'http://localhost:5000/graphql' }),
    cache: new InMemoryCache(),
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(HttpClientModule),
    Apollo,
    HttpLink,
    {
      provide: APOLLO_OPTIONS,
      useFactory: apolloClientFactory,
      deps: [HttpLink]
    }
  ]
}).catch(err => console.error(err));