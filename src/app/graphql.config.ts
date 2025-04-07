import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { importProvidersFrom, inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

const uri = 'https://krishna-comp3133-s101398578-assignment1-2.onrender.com/graphql';

export const provideGraphQL = () => [
  importProvidersFrom(HttpClientModule),
  provideApollo(() => {
    const httpLink = inject(HttpLink);
    return {
      link: httpLink.create({ uri }),
      cache: new InMemoryCache(),
    };
  })
];
