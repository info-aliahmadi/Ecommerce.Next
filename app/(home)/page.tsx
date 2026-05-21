'use client';

import { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Container, 
  Divider, 
  Grid, 
  Paper, 
  Typography, 
  TextField,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Search, ShoppingCart, ArrowForward, Email } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import CategoryService from '@dashboard/(ecommerce)/_service/CategoryService';
import ProductService from '@dashboard/(ecommerce)/_service/ProductService';
import CategoryModel from '@dashboard/(ecommerce)/_types/Product/CategoryModel';
import ProductModel from '@dashboard/(ecommerce)/_types/Product/ProductModel';

export default function HomePage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: session } = useSession();
  const [featuredCategories, setFeaturedCategories] = useState<CategoryModel[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const categoryService = new CategoryService(session?.accessToken ?? '');
        const productService = new ProductService(session?.accessToken ?? '');
        
        const categoriesResult = await categoryService.getCategoryList();
        if (categoriesResult.succeeded) {
          // Filter categories that are marked to show on homepage
          const homepageCategories = categoriesResult.data?.filter(cat => cat.showOnHomepage) || [];
          // Take up to 6 categories to display
          setFeaturedCategories(homepageCategories.slice(0, 6));
        }
        
        const productsResult = await productService.getAllProducts();
        if (productsResult.succeeded) {
          // Just take the first 8 products for now - in a real app you'd have a featured flag
          setFeaturedProducts(productsResult.data?.slice(0, 8) || []);
        }
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      }
    };
    
    loadData();
  }, [session]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random?ecommerce)',
          height: '500px'
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        <Grid container sx={{ height: '100%' }}>
          <Grid item md={6} sx={{ position: 'relative', p: { xs: 3, md: 6 }, pr: { md: 0 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography component="h1" variant="h3" color="inherit" gutterBottom>
              Welcome to Our Shop
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              Discover our wide range of products at amazing prices. Quality products delivered to your doorstep.
            </Typography>
            <Button variant="contained" color="primary" size="large" sx={{ mt: 2, alignSelf: 'flex-start' }}>
              Shop Now
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Container maxWidth="lg">
        {/* Search Bar */}
        <Paper 
          component="form" 
          sx={{ 
            p: '2px 4px', 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%',
            mb: 6,
            mt: -6,
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
          elevation={3}
          onSubmit={handleSearch}
        >
          <TextField
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search for products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            variant="standard"
            InputProps={{ disableUnderline: true }}
          />
          <IconButton type="submit" aria-label="search">
            <Search />
          </IconButton>
        </Paper>

        {/* Featured Categories */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Browse Categories
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={3}>
            {featuredCategories.length > 0 ? (
              featuredCategories.map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        height: 140,
                        backgroundColor: category.pictureId ? 'transparent' : 'grey.300',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                      image={category.pictureId ? `/api/picture/${category.pictureId}` : 'https://source.unsplash.com/random?category'}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {category.name}
                      </Typography>
                      <Typography>
                        {category.description?.substring(0, 80)}
                        {category.description && category.description.length > 80 ? '...' : ''}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2 }}>
                      <Button 
                        component={Link} 
                        href={`/category/${category.id}`}
                        endIcon={<ArrowForward />}
                      >
                        Browse
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1">No categories found.</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Featured Products */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Featured Products
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={3}>
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        height: 200,
                        backgroundColor: product.previewImageId ? 'transparent' : 'grey.300',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                      image={product.previewImageId ? `/api/picture/${product.previewImageId}` : 'https://source.unsplash.com/random?product'}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h2">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {product.shortDescription?.substring(0, 60)}
                        {product.shortDescription && product.shortDescription.length > 60 ? '...' : ''}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${product.price?.toFixed(2)}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
                      <Button 
                        component={Link} 
                        href={`/product/${product.id}`}
                        variant="outlined" 
                        size="small"
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<ShoppingCart />}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1">No products found.</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              href="/products"
            >
              View All Products
            </Button>
          </Box>
        </Box>

        {/* Special Offers */}
        <Paper 
          sx={{ 
            p: 4, 
            mb: 8, 
            bgcolor: 'primary.light', 
            color: 'primary.contrastText',
            backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05) 75%, transparent 75%, transparent)',
            backgroundSize: '30px 30px'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Special Offer!
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Get 20% off on all products with code: WELCOME20
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              sx={{ mt: isMobile ? 2 : 0 }}
            >
              Shop Now
            </Button>
          </Box>
        </Paper>

        {/* Newsletter */}
        <Paper sx={{ p: 4, mb: 8, bgcolor: 'background.paper' }}>
          <Typography variant="h5" gutterBottom align="center">
            Subscribe to Our Newsletter
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Stay updated with the latest products and special offers.
          </Typography>
          <Box 
            component="form" 
            sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              maxWidth: '600px', 
              mx: 'auto',
              gap: 2 
            }}
          >
            <TextField
              fullWidth
              placeholder="Your Email Address"
              variant="outlined"
              size="small"
            />
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<Email />}
              type="submit"
              sx={{ flexShrink: 0 }}
            >
              Subscribe
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Shop
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Link href="/products" style={{ textDecoration: 'none', marginBottom: '8px' }}>All Products</Link>
                <Link href="/categories" style={{ textDecoration: 'none', marginBottom: '8px' }}>Categories</Link>
                <Link href="/brands" style={{ textDecoration: 'none', marginBottom: '8px' }}>Brands</Link>
                <Link href="/sale" style={{ textDecoration: 'none', marginBottom: '8px' }}>Sale</Link>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Customer Service
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Link href="/contact" style={{ textDecoration: 'none', marginBottom: '8px' }}>Contact Us</Link>
                <Link href="/shipping" style={{ textDecoration: 'none', marginBottom: '8px' }}>Shipping & Returns</Link>
                <Link href="/faq" style={{ textDecoration: 'none', marginBottom: '8px' }}>FAQ</Link>
                <Link href="/terms" style={{ textDecoration: 'none', marginBottom: '8px' }}>Terms & Conditions</Link>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                My Account
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Link href="/login" style={{ textDecoration: 'none', marginBottom: '8px' }}>Sign In</Link>
                <Link href="/register" style={{ textDecoration: 'none', marginBottom: '8px' }}>Register</Link>
                <Link href="/orders" style={{ textDecoration: 'none', marginBottom: '8px' }}>Order History</Link>
                <Link href="/wishlist" style={{ textDecoration: 'none', marginBottom: '8px' }}>Wishlist</Link>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                About Us
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                We provide high-quality products at competitive prices, with excellent customer service.
              </Typography>
              <Typography variant="body2">
                Contact: info@example.com<br />
                Phone: +1 234 567 890
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 5 }}>
            <Divider />
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              © {new Date().getFullYear()} Your E-commerce Store. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
} 