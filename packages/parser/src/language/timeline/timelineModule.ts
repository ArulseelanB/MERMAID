import {
  type DefaultSharedModuleContext,
  type LangiumServices,
  type LangiumSharedServices,
  type Module,
  type PartialLangiumServices,
  createDefaultModule,
  createDefaultSharedModule,
  inject,
} from 'langium';

import { TimelineValueConverter } from './timelineValueConverter.js';
import { TimelineTokenBuilder } from './timelineTokenBuilder.js';
import { MermaidGeneratedSharedModule, TimelineGeneratedModule } from '../generated/module.js';
import { CommonLexer } from '../common/commonLexer.js';

/**
 * Declaration of `Timeline` services.
 */
export type TimelineAddedServices = {
  parser: {
    Lexer: CommonLexer;
    TokenBuilder: TimelineTokenBuilder;
    ValueConverter: TimelineValueConverter;
  };
};

/**
 * Union of Langium default services and `Timeline` services.
 */
export type TimelineServices = LangiumServices & TimelineAddedServices;

/**
 * Dependency injection module that overrides Langium default services and
 * contributes the declared `Timeline` services.
 */
export const TimelineModule: Module<
  TimelineServices,
  PartialLangiumServices & TimelineAddedServices
> = {
  parser: {
    Lexer: (services) => new CommonLexer(services),
    TokenBuilder: () => new TimelineTokenBuilder(),
    ValueConverter: () => new TimelineValueConverter(),
  },
};

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 * @param context - Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createTimelineServices(context: DefaultSharedModuleContext): {
  shared: LangiumSharedServices;
  Timeline: TimelineServices;
} {
  const shared: LangiumSharedServices = inject(
    createDefaultSharedModule(context),
    MermaidGeneratedSharedModule
  );
  const Timeline: TimelineServices = inject(
    createDefaultModule({ shared }),
    TimelineGeneratedModule,
    TimelineModule
  );
  shared.ServiceRegistry.register(Timeline);
  return { shared, Timeline };
}
