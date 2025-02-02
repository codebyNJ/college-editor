'use client';

import LAYOUT_ASSETS from './CustomLayouts.json';
import { ExportDesignPanelPlugin } from './ExportDesignPanelPlugin';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import { createApplyLayoutAsset } from './lib/createApplyLayoutAsset';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';

const caseAssetPath = (path, caseId = 'layouts') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

const CombinedCESDK = () => {
  const config = useConfig(
    () => ({
      role: 'Creator',
      theme: 'dark',
      license: process.env.NEXT_PUBLIC_LICENSE,
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
      ui: {
        elements: {
          navigation: {
            action: {
              export: {
                show: true,
                format: ['image/png', 'application/pdf']
              }
            }
          },
          libraries: {
            replace: {
              floating: false,
              autoClose: false
            },
            insert: {
              autoClose: false,
              floating: false
            }
          }
        }
      },
      i18n: {
        en: {
          'libraries.ly.img.layouts.label': 'Layouts'
        }
      }
    }),
    []
  );

  const configure = useConfigure(async (instance) => {
    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
    instance.feature.enable('ly.img.placeholder', true);
    instance.feature.enable('ly.img.preview', true);
    instance.addPlugin(ExportDesignPanelPlugin());

    instance.ui.setNavigationBarOrder([
      'ly.img.back.navigationBar',
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.zoom.navigationBar',
      'ly.img.export-options-design.navigationBar'
    ]);

    instance.ui.setDockOrder([
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'ly.img.layouts',
        label: 'libraries.ly.img.layouts.label',
        icon: ({ iconSize }) => {
          return iconSize === 'normal'
            ? caseAssetPath('/collage-small.svg')
            : caseAssetPath('/collage-large.svg');
        },
        entries: ['ly.img.layouts']
      },
      'ly.img.separator',
      ...instance.ui.getDockOrder().filter(({ key }) => !['ly.img.template'].includes(key))
    ]);

    instance.ui.addAssetLibraryEntry({
      id: 'ly.img.layouts',
      sourceIds: ['ly.img.layouts'],
      previewLength: 2,
      gridColumns: 2,
      gridItemHeight: 'square',
      previewBackgroundType: 'contain',
      gridBackgroundType: 'contain'
    });

    loadAssetSourceFromContentJSON(
      instance.engine,
      LAYOUT_ASSETS,
      caseAssetPath(''),
      createApplyLayoutAsset(instance.engine)
    );

    await instance.loadFromURL(caseAssetPath('/custom-layouts.scene'));
  }, []);

  return (
    <div style={wrapperStyle}>
      <div className="cesdkWrapperStyle">
        <CreativeEditor className="cesdkStyle" config={config} configure={configure} />
      </div>
    </div>
  );
};

const wrapperStyle = {
  minHeight: '640px',
  display: 'flex',
  borderRadius: '0.75rem',
  flexGrow: '1',
  gap: '1rem'
};

export default CombinedCESDK;
